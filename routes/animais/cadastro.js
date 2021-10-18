const express = require("express")
const mongoose = require('mongoose')
const fs = require('fs')
const router = express.Router()
const upload = require('./../../middlewares/upload')
const authToken = require('./../../middlewares/authToken')

// models
require('./../../models/usuarios')
require('./../../models/animais')
require('./../../models/messages')
const Usuarios = mongoose.model("usuarios")
const Animais = mongoose.model("animais")
const Mensagens = mongoose.model("mensagens")

// TODO: testar rota de ciração de animal
router.post("/",authToken.obrigatorio, upload.single('img'), async (req, res) => {

	// * verificar existência do arquivo de imagem
	if(!req.file){
		console.log("ERRO: tentativa de adicionar animal sem uma imagem")

		res.status(401).send({
			msg: "é necessário uma imagem para o registro do animal"
		})
	}

	// * verificando se ong é valida
	try {
		var usuario = await Usuarios.findOne({_id: req.data.id}).populate("ong")
		if (usuario.tipo === "ong" && !usuario.ong.verificado){
			if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
			res.status(401).send({
				msg: "usuário não é verificado"
			})
		}else{
			
			var animal = {
				nome: req.body.nome,
				especie: req.body.especie, // "cao" ou "gato"
				pelagem: req.body.pelagem,
				porte: req.body.porte, // "p", "pm", "m", "mg", "g"
				idade: req.body.idade,
				observacao: req.body.observacao,
				vacinas: req.body.vacinas, // "integral", "parcial", "nao_vacinado"
				doencas: req.body.doencas, // array
				alergias: req.body.alergias, // array
				deficiencias: req.body.deficiencias, // array
				responsavel: req.data.id, // não enviar
				foto: req.file.path // o nome do campo que eu tenho que receber é "img"
			}

			var newAnimal = await new Animais(animal).save()
			console.log(`novo animal criado::\n${JSON.stringify(newAnimal)}`)
			res.status(200).send({
				msg: "novo animal criado"
			})
		}
	}catch(e){
		console.log(`erro ao criar dados do animal:::${e}`)
		if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
		res.status(500).send({
			msg: "erro ao criar os dados do animai"
		})
	}
	
})


module.exports = router