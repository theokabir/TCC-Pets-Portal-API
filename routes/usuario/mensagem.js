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

router.post('/deletar', authToken.obrigatorio, async (req, res) => {

  try{

    var mensagemId = req.body.mensagem
    if (mensagemId) {
      var mensagem = await Mensagens.findOne({_id: mensagemId})
      if (mensagem.remetente !== req.data.id) 
        throw {
          code: 401,
          msg: "usuário não tem autorização para excluir tal mensagem"
        }

      await Mensagens.deleteOne({_id: mensagemId})
    }else{
      await Mensagens.Delete({remetente: req.data.id})
    }

    console.log("mensagens deletadas")
    res.status(200).send({
      msg: "mensagem(s) deletada(s)"
    })

  }catch(e){
    console.log(`erro o tentar deletar mensagem(s):::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: e.msg || "erro ao tentar deletar mensagem(s)"
    })
  }

})

module.exports = router