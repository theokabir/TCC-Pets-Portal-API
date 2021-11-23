const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')
const config = require('./../../config/config.json')

require('./../../models/animais')
require('./../../models/usuarios')
require('./../../models/eventos')
const Animais = mongoose.model('animais')
const Usuarios = mongoose.model('usuarios')
const Eventos = mongoose.model('eventos')

router.post('/carousel', authToken.opcional, async (req, res) => {

  try{

    var animais

    if(!req.data){
      animais = await Animais.find({habilitado: true}).sort({data: 1}).limit(req.body.carouselCount)
    }else{
      console.log("data: " + req.data)
      var user = await Usuarios.findOne({_id: req.data.id})
      animais = await Animais.find({
        responsavel: {
          $ne: req.data.id
        },
        habilitado: true
      }).populate({
        path: "responsavel",
        match: {
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
        },
        select: "_id"
      })
      .select("_id nome foto").sort({data: 1}).limit(req.body.carouselCount)
    }

    console.log('animaisdo carrosel foram listados')

    var msg = {
      msg: "animais listados com sucesso",
      animais
    }

    msg.logado = (req.data)?true:false

    console.log("aaaaaaaaaaaa" + msg)

    res.status(200).send(msg)

  }catch(e){

    console.log('erro ao listar animais do carrosseul ' + e)

    res.status(500).send({
      msg: "erro ao listar animais do carrossel"
    })

  }

})

router.post('/maisAnimais', authToken.opcional, async (req, res) => {

  try{

    var animais

    if(!req.data){
      animais = await Animais.find({habilitado: true})
      .sort({data: 1})
      .skip(req.body.pag * req.body.quant + req.body.carouselCount)
      .limit(req.body.quant)
    }else{
      console.log("data: " + req.data)
      var user = await Usuarios.findOne({_id: req.data.id})
      animais = await Animais.find({
        responsavel: {
          $ne: req.data.id
        },
        habilitado: true
      })
      .populate({
        path: "responsavel",
        match: {
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
        },
        select: "_id"
      })
      .select("_id nome foto")
      .sort({data: 1})
      .skip(req.body.pag * req.body.quant + req.body.carouselCount)
      .limit(req.body.quant)
    }

    console.log('animaisdo carrosel foram listados')
    console.log(req.body)
    

    res.status(200).send({
      msg: "animais listados com sucesso",
      animais
    })

  }catch(e){

    console.log('erro ao listar animais do carrosseul ' + e)

    res.status(500).send({
      msg: "erro ao listar animais do carrossel"
    })

  }

})

router.post('/eventos', authToken.opcional, async (req, res) => {
  try{  
    var eventos

    if(!req.data){
      eventos = await Eventos.find({
        data: {
          $gte: Date.now()
        }, 
        verificado: true
      }).sort({data: 1}).limit(req.body.carouselCount)
    }else{
      console.log("data: " + req.data)
      var user = await Usuarios.findOne({_id: req.data.id})
      eventos = await Eventos.find({
        responsavel: {
          $ne: req.data.id
        },
        data: {
          $gt: Date.now()
        },
        verificado: true
      }).populate({
        path: "responsavel",
        match: {
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
        },
        select: "_id"
      })
      .select("banner").sort({data: 1}).limit(req.body.carouselCount)
    }

    console.log("eventos listados com sucesso")

    res.status(200).send({
      msg: "eventos listados com sucesso",
      eventos
    })
  }catch(e){
    console.log(`erro ao listar eventos:::${e}`)

    res.status(500).send({
      msg: "erro ao listar eventos da home"
    })
  }
})

module.exports = router