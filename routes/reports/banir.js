const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose  = require('mongoose')

require('./../../models/reports')
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
require('./../../models/animais')
const Reports = mongoose.model('reports')
const Usuarios = mongoose.model('usuarios')
const Fisicos = mongoose.model('fisicos')
const Ongs = mongoose.model('ongs')
const Animais = mongoose.model('animais')

router.post('/',authToken.obrigatorio, async (req, res) => {

  try{

    var admin = await Usuarios.findOne({_id: req.data.id})
    if (admin.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuario não é administrador para acessar está página"
      }
      throw err
    }

    var usuario = await Usuarios.findOne({_id: req.body.usuario})

    if(usuario.tipo == "nrm"){
      await Fisicos.deleteOne({_id: usuario.fisico})
      usuario.fisico = null
      usuario.banido = true
      usuario.save()
    }
    else if (usuario.tipo == "ong"){
      await Ongs.deleteOne({_id: usuario.ong})
      usuario.ong = null
      usuario.banido = true
      usuario.save()
    }

    var animais = await Animais.find({responsavel: usuario._id})

    animais.map((animal) => {
      animal.habilitado = false
      animal.save()
    })

    console.log('Usuario banido com sucesso')

    res.status(200).send({
      msg: "usuário banido com sucesso"
    })
   
  }catch(e){

    console.log(`erro ao banir usuario::::${e}`)

    res.status(500).send({
      msg: "erro ao banir usuario"
    })

  }

})

module.exports = router