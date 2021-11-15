const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/usuarios')
require('./../../models/eventos')
const Usuarios = mongoose.model('usuarios')
const Eventos = mongoose.model('eventos')


router.post('/', authToken.obrigatorio, async (req, res) => {

  try{

    var user = Usuarios.findOne({_id: reqq.data.id})
    if (user.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuário não é um administrador"
      }
      throw err
    }

    var eventos = Eventos.find({verifficado: false})
    .skip(req.body.skip || 0).limit(req.body.limit || 1000)

    console.log(`eventos listados como sucesso`)

    res.status(200).send({
      msg: "eventos listados com sucessso",
      eventos
    })
  }catch(e){

    console.log(`erro ao listar os eventos:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: "erro ao listar eventos"
    })

  }

})

router.post('/validate', authToken.obrigatorio, async (req, res) => {

  try{

    var user = Usuarios.findOne({_id: reqq.data.id})
    if (user.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuário não é um administrador"
      }
      throw err
    }

    var evento = Eventos.findOne({_id: req.body.evento})
    evento.verificado = true
    evento.save()

    console.log(`eveto verificado com sucesso`)

    res.status(200).send({
      msg: "evento validado com sucesso"
    })
  }catch(e){

    console.log(`erro ao validar evento:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: "erro ao validar evento"
    })

  }

})

module.exports = router