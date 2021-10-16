const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require("./../../middlewares/authToken")

require('./../../models/messages')
const Mensagens = mongoose.model('mensagens')

const cadastroRouter = require('./cadastro')

router.use("/cadastro", cadastroRouter)

router.get('/', (req, res) => {
    res.status(200).send({
        msg: "rota raiz de animais"
    })
})


// TODO: testar rota
router.post("/mensagem", authToken.obrigatorio, async (req, res) => {

	var mensagem = {
		remetente: req.data.id,
		destinatario: req.body.destinatario,
		animal: req.body.animal,
		assunto: req.body.assunto,
		msg: req.body.msg
	}

	try{
		var newMensagem = await Mensagens(mensagem).save()
		console.log(`mensagem ${newMensagem._id} enviada`)
		res.status(200).send({
			msg: "mensagem enviada"
		})
	}catch(e){
		console.log(`erro ao enviar mensagem:::${e}`)

		res.status(500).send({
			msg: "erro ao enviar mensagem"
		})
	}

})



module.exports = router