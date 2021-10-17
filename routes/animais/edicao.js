const express = require('express')
const router = express.Router()
const upload = require('./../../middlewares/upload')
const mongoose = require('mongoose')
const fs = require('fs')
const authToken = require('./../../middlewares/authToken')

require('./../../models/animais')
const Animais = mongoose.model('animais')

//TODO: testar rota
router.post('/', authToken.obrigatorio, async (req, res) => {

	var newAnimal = {
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
		responsavel: req.data.id
	}

	try{

		var animal = await Animais.findOne({_id: req.body.animal})
		if (animal.responsavel !== req.data.id){
			var erro = {
				code: 401,
				msg: "usuário não é o responsável pelo animal"
			}
			throw erro
		}
		animal = newAnimal
		newAnimal = await animal.save()
		console.log(`animal alterado:::${newAnimal}`)
		res.status(200).send({
			msg: "animal alterado"
		})

	}catch(e){
		console.log(`erro ao fazer a alteração do animal:::${e}`)

		res.status(e.code || 500).send({
			msg: e.msg || "erro ao alterar os dados do animal"
		})
	}

})

//TODO: testar rota
router.post('/foto', authToken.obrigatorio, upload.single('img'), async (req, res) => {

	try{

		var animal = await Animais.findOne({_id: req.body.animal})
		if(animal.responsavel !== req.data.id){
			var erro = {
				code: 401,
				message: "usuário não é o responsavel pelo animal para fazer a edição"
			}

			throw erro
		}
		animal.foto = req.file.path
		await animal.save()
		fs.unlinkSync(animal.foto)
		console.log('foto alterada')
		res.status(200).send({
			msg: "foto alterada com sucesso"
		})

	}catch(e){
		if(fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
		console.log(`erro ao alterar foto:::${e.message || e}`)
		res.status(e.code || 500).send({
			msg: "erro ao editar foto"
		})
	}

})

module.exports = router