//TODO: testar
const express = require("express")
const mongoose = require('mongoose')
const router = express.Router()
const upload = require('./../../middlewares/upload')
const gcs = require('./../../middlewares/gcs')
const authToken = require('./../../middlewares/authToken')

// models
require('./../../models/usuarios')
require('./../../models/animais')
const Usuarios = mongoose.model("usuarios")
const Animais = mongoose.model("animais")

router.post("/",authToken.obrigatorio, upload.single('img'),gcs.upload, async (req, res) => {

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
			gcs.delete(req.newFile)
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
				foto: req.newFile // o nome do campo que eu tenho que receber é "img"
			}

			var newAnimal = await new Animais(animal).save()
			console.log(`novo animal criado::\n${JSON.stringify(newAnimal)}`)
			res.status(200).send({
				msg: "novo animal criado"
			})
		}
	}catch(e){
		console.log(`erro ao criar dados do animal:::${e}`)
		gcs.deletar(req.newFile)
		res.status(500).send({
			msg: "erro ao criar os dados do animai"
		})
	}
	
})


module.exports = router