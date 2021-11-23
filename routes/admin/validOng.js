const { compareSync } = require('bcrypt')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Ongs = mongoose.model('ongs')

router.post('/', authToken.obrigatorio, async (req, res) => {

  try{

    var admin = await Usuarios.findOne({_id: req.data.id})
    if (admin.tipo != "adm"){
      console.log(admin)
      var err ={
        code: 401,
        msg: "usuário não é o administrador"
      } 
      throw err
    }

    // var query = {
    //   tipo: "ong"
    // }

    // if(req.body.nome)
    //   query.nome = {
    //     $regex: req.body.nome.replace(/\s+/g, ' ').trim(),
    //     $options: 'i'
    //   }

    // var ongs = []
    
    // var limit = (query.nome)?1000:req.body.limit||10

    // for(var i = 0; i < limit; i++){

    //   var skip = (req.body.skip || 0) + i
    //   var ong = await Usuarios.findOne(query).skip(skip)
    //   .populate({
    //     path: "ong",
    //     select: 'estadoSocial'
    //   }).select('nome imagem email')

    //   console.log(query)
    //   if(!ong) break
    //   if(ong.ong.verificado == false) ongs.push(ong)
    // }

    var ongsRes = await Usuarios.find({tipo: 'ong'})
    .populate({
      path: "ong",
      select: 'estadoSocial verificado'
    })
    

    var ongs = ongsRes.filter(ong => {
      console.log(ong)
      if(!ong.ong) return false
      if(!ong.ong.verificado) return ong
    })
    console.log("ongs não verificadas foram listadas")

    res.status(200).send({
      msg: "ongs listadas com sucesso",
      ongs
    })
    

  }catch(e){

    console.log(`erro ao listar ongs:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: "erro ao listar ongs"
    })

  }

})

router.post('/validate', authToken.obrigatorio, async (req, res) => {

  try{

    var admin = await Usuarios.findOne({_id: req.data.id})

    if (admin.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuário não é administrador para acessar essa função"
      }
      throw err
    }

    var user = await Usuarios.findOne({_id: req.body.ong, tipo: "ong"})
    var ong = await Ongs.findOne({_id: user.ong})

    ong.verificado = true

    ong.save()

    console.log(`ong validada com sucesso`)

    res.status(200).send({
      msg: "ong validada com sucesso"
    })

  }catch(e){

    console.log(`erro ao validar ong:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: "erro ao validar ong"
    })

  }

})

module.exports = router