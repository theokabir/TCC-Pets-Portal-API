const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')
const config = require('./../../config/config')

require('./../../models/animais')
require('./../../models/usuarios')
require('./../../models/eventos')
const Animais = mongoose.model('animais')
const Usuarios = mongoose.model('usuarios')
const Eventos = mongoose.model('eventos')

router.post('/animais',authToken.opcional, async (req, res) => {
  try{
    
    var query = {}
    var populate = {
      path: 'responsavel',
      select: '_id'
    }

    //pesquisa de animais
    query.especie = (req.body.especie)?req.body.especie:undefined // select de especie
    query.porte = (req.body.porte)?req.body.porte:undefined // select deporte
    query.idade.$gte = (req.body.minIdade)?req.body.minIdade:undefined //minimo de idade
    query.idade.$lte = (req.body.maxIdade)?req.body.maxIdade:undefined // máximo de idade

    if(req.data){

      var user = await Usuarios.findOne({_id: req.data.id})

      query.responsavel = {$ne: req.body.id}

      populate.match = {
        $or: [
          {
            ddd1: {
              $gte: user.ddd1 - config.searchRange,
              $lte: user.ddd1 + config.searchRange
            }
          },
          {
            ddd2: {
              $gte: user.ddd1 - config.searchRange,
              $lte: user.ddd1 + config.searchRange
            }
          },
          {
            ddd1: {
              $gte: user.ddd2 - config.searchRange,
              $lte: user.ddd2 + config.searchRange
            }
          },
          {
            ddd2: {
              $gte: user.ddd2 - config.searchRange,
              $lte: user.ddd2 + config.searchRange
            }
          }
        ]
      }
    }

    var animais = await Animais.find(query).populate(populate)
    .skip(req.body.skip || 0).limit(req.body.limit || 0)

    console.log("animais listados")

    res.status(200).send({
      msg: "animais listados",
      animais
    })

  }catch(e){
    console.log(`erro ao listar animais:::${e}`)

    res.status(500).send({
      msg: "erro ao listar animais"
    })
  }
})

router.post('/eventos', authToken.opcional, async (req, res) => {
  try{

    var query = {}
    var populate = {
      path: 'responsavel',
      select: '_id'
    }

    //pesquisa de evento
    query.nome = (req.body.nome)?{$regex: req.body.nome}:undefined // input text de nome
    query.local  = (req.body.local)?{$regex: req.body.local}:undefined // input text de local
    query.especie = (req.body.especie)?req.body.especie:undefined // select de especies
    query.data = {$gte: Date.now()} // não precisa
    query.verificado = true // não precisa

    if(req.data){
      var user = await Usuarios.findOne({_id: req.data.id})

      query.responsavel = {$ne: req.body.id}
      
      populate.match = {
        $or: [
          {
            ddd1: {
              $gte: user.ddd1 - config.searchRange,
              $lte: user.ddd1 + config.searchRange
            }
          },
          {
            ddd2: {
              $gte: user.ddd1 - config.searchRange,
              $lte: user.ddd1 + config.searchRange
            }
          },
          {
            ddd1: {
              $gte: user.ddd2 - config.searchRange,
              $lte: user.ddd2 + config.searchRange
            }
          },
          {
            ddd2: {
              $gte: user.ddd2 - config.searchRange,
              $lte: user.ddd2 + config.searchRange
            }
          }
        ]
      }
    }

    var eventos = await Eventos.find(query).populate(populate)
    .skip(req.body.skip || 0).limit(req.body.limit || 0)

    console.log("eventos listados com sucesso")

    res.status(200).send({
      msg: "eventos listados com sucesso",
      eventos
    })

  }catch(e){
    console.log(`erro ao listar eventos:::${e}`)

    res.status(500).send({
      msg: "erro ao listar eventos"
    })
  }
})

module.exports = router