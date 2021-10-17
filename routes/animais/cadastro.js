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
		}
	}catch(e){
		console.log(`erro ao manejar usuários:::${e}`)
		res.status(500).send({
			msg: "erro ao consultar banco de dados"
		})
	}
	
	var animal = {
		nome: req.body.nome,
		especie: req.body.especie,
		pelagem: req.body.pelagem,
		porte: req.body.porte,
		idade: req.body.idade,
		observacao: req.body.observacao,
		vacinas: req.body.vacinas,
		doencas: req.body.doencas,
		alergias: req.body.alergias,
		deficiencias: req.body.deficiencias,
		responsavel: req.data.id,
		foto: req.file.path
	}

	try{
		var newAnimal = await new Animais(animal).save()
		console.log(`novo animal criado::\n${JSON.stringify(newAnimal)}`)
		res.status(200).send({
			msg: "novo animal criado"
		})
	}catch(e){
		console.log(`erro ao criar dados do animal:::${e}`)
		if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
		res.status(500).send({
			msg: "erro ao criar os dados do animai"
		})
	}
	
})


module.exports = router