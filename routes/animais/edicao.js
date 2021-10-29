//TODO: testar
const express = require('express')
const router = express.Router()
const upload = require('./../../middlewares/upload')
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')
const gcs = require('./../../middlewares/gcs')

require('./../../models/animais')
const Animais = mongoose.model('animais')

router.post('/foto', authToken.obrigatorio, upload.single('img'), gcs.upload, async (req, res) => {

	try{

		var animal = await Animais.findOne({_id: req.body.id})
		if(animal.responsavel != req.data.id){
			var erro = {
				code: 401,
				message: "usuário não é o responsavel pelo animal para fazer a edição"
			}

			throw erro
		}
		var delImage = animal.foto
		animal.foto = req.newFoto
		await animal.save()
		console.log('foto alterada')
		gcs.delete(delImage)
		res.status(200).send({
			msg: "foto alterada com sucesso"
		})

	}catch(e){
		gcs.delete(req.newfoto)
		console.log(`erro ao alterar foto:::${e.message || e}`)
		res.status(e.code || 500).send({
			msg: "erro ao editar foto"
		})
	}

})

router.post('/:campo', authToken.obrigatorio, async (req, res, next) => {

	var valor = req.body.valor
	var campo = req.params.campo

	try{

		var animal = await Animais.findOne({_id: req.body.id})
		if (animal.responsavel != req.data.id){
			var erro = {
				code: 401,
				msg: "usuário não é o responsável pelo animal"
			}
			throw erro
		}

		switch (campo){
			case 'nome':
				animal.nome = valor
				break
			case 'especie':
				animal.especie = valor
				break
			case 'pelagem':
				animal.pelagem = valor
				break
			case 'porte':
				animal.porte = valor
				break
			case 'idade':
				animal.idade = valor
				break
			case 'observacao':
				animal.observacao = valor
				break
			case 'vacinas':
				animal.vacinas = valor
				break
			case 'doencas':
				animal.doencas = valor
				break
			case 'alergias':
				animal.alergias = valor
				break
			case 'deficiencias':
				animal.deficiencias = valor
				break
			case 'foto':
				next()
				break
			default:
				var erro = {
					code: 500,
					msg: "campo inexistente"
				}
				throw erro
		}

		// animal.nome = newAnimal.nome || animal.nome
		// animal.especie = newAnimal.especie || animal.especie
		// animal.pelagem = newAnimal.pelagem || animal.pelagem 
		// animal.porte = newAnimal.porte || animal.porte
		// animal.idade = newAnimal.idade || animal.idade
		// animal.observacao = newAnimal.observacao
		// animal.vacinas = newAnimal.vacinas
		// animal.doencas = newAnimal.doencas 
		// animal.alergias = newAnimal.alergias 
		// animal.deficiencias = newAnimal.deficiencias

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

module.exports = router