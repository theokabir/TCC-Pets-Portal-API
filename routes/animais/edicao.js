const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')

require('./../../models/animais')
const Animais = mongoose.model('animais')

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
			msg: "erro ao alterar os dados do animal"
		})
	}

})

module.exports = router