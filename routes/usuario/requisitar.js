/**
 * 
 * rota: api/user/read
 * 
*/

//express
const express = require('express')
const router = express.Router()

//middlewares
const authToken = require('./../../middlewares/authToken')

//modals
const mongoose = require('mongoose')
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
require('./../../models/animais')
require('./../../models/eventos')
require('./../../models/reports')
//require('./../../models/pedidos')
const Usuarios = mongoose.model('usuarios')
const Animais = mongoose.model('animais')
const Eventos = mongoose.model('eventos')
const Reports = mongoose.model('reports')
//const Pedidos = mongoose.model('pedidos')
//const Ongs = mongoose.model('ongs')

//config
const config = require('./../../config/config.json')

//rotas
router.post('/',authToken.opcional, async (req, res) => {

  console.log(req.body)

  var populateF = {
    path: "fisico"
  }
  var populateO = {
    path: "ong"
  }
  var select = ""
  
  me = false

  if (req.data && (req.data.id == req.body.id)) {

    select += "-senha"
    populateF.select = "-_id"
    populateO.select = "-_id"
    me = true

  }else{
    populateF.select = "desc -_id"
    populateO.select = "desc -_id verificado"
    select = "nome email imagem tipo"
  }

  var admin = {
    tipo: "indefinido"
  }

  if(req.data){
    Usuarios.findOne({_id: req.data.id})
    .then(user => {
      console.log("acessando::::")
      console.log(user)
      admin = user
    }).catch(e => {
      console.log('deu meio ruim')
    })
  }

  Usuarios.findOne({_id: req.body.id}) 
  .select(select).populate(populateF).populate(populateO)
  .then(async user => {

    console.log("1: " + user.tipo)
    console.log("2: " + admin.tipo)
    
    if (user.tipo == "ong" && !user.ong.verificado && !me && admin.tipo != "adm"){

      console.log(user)

      console.log("ong não verificada")

      res.status(401).send({
        msg: "esta ong não é verificada"
      })
    }
    else {
      console.log(`usuário consultado::${user}`)
      console.log(`token: ${req.data.id} || body: ${req.body.id}`)
      try {
        var animais = await Animais.find({responsavel: user._id}).select("_id foto")
        if (me){
          //var pedidos = await Pedidos.find({adotante: user._id}) 
        }
        var eventos = await Eventos.find({responsavel: user._id}).select("-editado")

        if(req.data){
          var admin2 = await Usuarios.findOne({_id: req.data.id})
          
          console.log("3: " + admin2.tipo)
          if (admin2.tipo == "adm"){
            var reports = await Reports.find({usuario: user._id}).sort({contagem: "asc"})
          }
        }
      }catch(e){

        

        console.log(`erro ao listar animais ou mensagens:::${e}`)

        res.status(500).send({
          msg: "erro ao listar os animais ou mensagens"
        })
      }
      res.status(200).send({
        msg: "usuário consultado com sucesso",
        me,
        user,
        animais,
        eventos,
        reports: reports || []
      })
    }

  })
  .catch(e => {
    console.log(`erro ao encontrar usuário com id:${req.body.id}\nerro::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar suár qio"
    })

  })

})

router.post('/ongs',authToken.opcional, async (req, res) => {

  var findQuery = {
    tipo: "ong"
  }

  if (req.data){
    await Usuarios.findOne({_id: req.data.id})
    .then(user => {
      findQuery.ddd1 = {
        $gte: user.ddd1 - config.searchRange,
        $lte: user.ddd1 + config.searchRange
      }
    })
    .catch(e => {
      console.log(`erro ao encontrar usuário::${e}`)

      res.status(500).send({
        msg: "erro ao encontrar usuário"
      })
    })
  }else{
    findQuery.ddd1 = {
      $in: [11, 21, 27, 31, 41, 48, 51, 61, 62, 63, 67, 68, 69, 71, 79, 81, 82, 83, 84, 85, 86, 91, 92, 95, 96, 98]
    }
  }

  Usuarios.find(findQuery).populate("ong")
  .then(ongs => {

    var page = req.body.page || 1
    var limit = req.body.limit || 5

    var resOngs = ongs.filter(ongs => ongs.ong.verificado === true)
    var ongsCount = resOngs.length
    var startIndex = parseInt((page - 1) * limit)
    var endIndex = parseInt(page * limit)
    resOngs = resOngs.slice(startIndex, endIndex)

    var previous
    var next

    if(startIndex>0) previous = true
    else previous = false

    if(endIndex<ongsCount) next = true
    else next = false
    


    res.status(200).send({
      msg: "ongs listadas com sucesso",
      ongsCount,
      ongs: resOngs,
      previous,
      next
    })

  })
  .catch(e => {
    console.log(`erro ao listar ongs:::${e}`)

    res.status(500).send({
      msg: "erro ao listar ongs"
    })
  })



})

//export
module.exports = router