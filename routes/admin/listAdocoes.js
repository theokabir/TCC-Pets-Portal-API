const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/adocoes')
require('./../../models/usuarios')
const Usuarios = mongoose.model('usuarios')
const Adocoes = mongoose.model('adocoes')

router.post('/', authToken.obrigatorio, async (req, res) => {

  try{

    var admin = await Usuarios.findOne({_id: req.data.id})
    if (admin.tipo != "adm"){
      var err = {
        code: 401,
        msg: "usuario não é administrador para acessar está página"
      }
      throw err
    }

    var adocoes = await Adocoes.find()
    .populate({path: 'adotante', select: 'nome'})
    .populate({path: 'doador', select: 'nome'})
    .populate({path: 'animal', select: 'nome foto'})
    .sort({data: -1}).skip(req.body.skip || 0).limit(req.body.limit || 10)

    res.status(200).send({
      msg: "adoções listadascom sucesso",
      adocoes
    })

  }catch(e){
    console.log(`erro ao listar as adoções:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: "erro ao listar adoções"
    })
  }

})

module.exports = router