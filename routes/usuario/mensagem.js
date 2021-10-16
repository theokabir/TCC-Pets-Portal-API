const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/usuarios')
require('./../../models/messages')
const Mensagens = mongoose.model('mensagens')

//TODO: testar rota
router.post('/responder', authToken.obrigatorio, async (req, res) => {

  try{

    var mensagem = await Mensagens.findOne({_id: req.body.mensagem})
    mensagem.resposta = req.body.resposta
    var newMensagem = await mensagem.save()

    console.log(`mensagem respondida:::${newMensagem}`)
    res.status(200).send({
      msg: "mensagem respondida"
    })

  }catch(e){

    cosole.log(`erro ao enviar resposta:::${e}`)

    res.status(500).send({
      msg: "erro ao envoar resposta"
    })
  }

})

module.exports = router