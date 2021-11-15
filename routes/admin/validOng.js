const { compareSync } = require('bcrypt')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/usuarios')
//require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Ongs = mongoose.model('ongs')

router.post('/', authToken.obrigatorio, async (req, res) => {

  try{

    var admin = Usuarios.find({_id: req.data.id})
    if (admin.tipo != "adm"){
      var err ={
        code: 401,
        msg: "usuário não é o administrador"
      } 
      throw err
    }

    var ongs = Usuarios.find({tipo: "ong"}).populate({
      path: "ong",
      match: {verificado:  false}
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

    var admin = Usuarios.findOne({_id: req.data.id})

    if (admin.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuário não é administrador para acessar essa função"
      }
      throw err
    }

    var user = Usuarios.find({_id: req.body.ong, tipo: "ong"})
    var ong = Ongs.findOne({_id: user.ong})

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