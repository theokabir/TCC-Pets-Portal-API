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

    if(req.body.adotante ||
       req.body.doador   ||
       req.body.animal){
        
        req.body.skip = 0,
        req.body.limit = 100000

    }

    var adocoes = await Adocoes.find()
    .populate({path: 'adotante', select: 'nome'})
    .populate({path: 'doador', select: 'nome'})
    .populate({path: 'animal', select: 'nome foto'})
    .sort({data: -1}).skip(req.body.skip || 0).limit(req.body.limit || 10)

    if(req.body.adotante)
      adocoes = adocoes.filter(adocao => adocao.adotante.nome.toUpperCase().indexOf(req.body.adotante.toUpperCase().replace(/\s+/g,' ').trim()) != -1)

    if(req.body.doador)
      adocoes = adocoes.filter(adocao => adocao.doador.nome.toUpperCase().indexOf(req.body.doador.toUpperCase().replace(/\s+/g,' ').trim()) != -1)

    if(req.body.animal)
      adocoes = adocoes.filter(adocao => adocao.animal.nome.toUpperCase().indexOf(req.body.animal.toUpperCase().replace(/\s+/g,' ').trim()) != -1)


    if(
      (
        req.body.adotante ||
        req.body.doador   ||
        req.body.animal
      ) && 
      req.body.btn == true
    )
      {
        res.status(200).send({
          msg: "não há mais adoções a serem listadas",
          adocoes: []
        })
      }
    else
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