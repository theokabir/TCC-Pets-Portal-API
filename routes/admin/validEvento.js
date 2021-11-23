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

    var user = await Usuarios.findOne({_id: req.data.id})
    if (user.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuário não é um administrador"
      }
      throw err
    }

    var query = {
      verificado: false
    }

    if(req.body.nome)
      query.nome = {
        $regex: req.body.nome.replace(/\s+/g, ' ').trim(),
        $options: 'i'
      }
    if(req.body.local)
      query.local = {
        $regex: req.body.local.replace(/\s+/g, ' ').trim(),
        $options: 'i'
      }

    var eventos = await Eventos.find(query)
    .select('banner data local nome observacao responsavel')
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

    var user = await Usuarios.findOne({_id: req.data.id})
    if (user.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuário não é um administrador"
      }
      throw err
    }

    var evento = await Eventos.findOne({_id: req.body.evento})
    .skip(req.body.skip || 0).limit(req.body.limit || 10)
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