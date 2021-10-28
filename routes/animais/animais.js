const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require("./../../middlewares/authToken")

require('./../../models/animais')
require('./../../models/messages')
require('./../../models/adocoes')
require('./../../models/usuarios')
const Mensagens = mongoose.model('mensagens')
const Animais = mongoose.model('animais')
const Usuarios = mongoose.model('usuarios')
const Adocoes = mongoose.model('adocoes')

const cadastroRouter = require('./cadastro')
const edicaoRouter = require('./edicao')
const deleteRouter = require('./delete')

router.use("/cadastro", cadastroRouter)
router.use("/edit", edicaoRouter)
router.use("/delete", deleteRouter)

//TODO: testar rota
// ? rota com login obrigatorio
router.post('/', authToken.obrigatorio, (req, res) => {
    //TODO: rota de pesquisa
})

router.post('/adotar', authToken.obrigatorio, async (req, res) => {

    try{

        var animalId = req.body.animal
        var adotanteId = req.body.adotante
    
        var animal = await Animais.findOne({_id: animalId})
        var adotante = await Usuarios.findOne({_id: adotanteId})
    
        if (animal.responsavel != req.data.id){
            var err = {
                code: 401,
                msg: "usuário não é o dono do animal"
            }

            throw err
        }

        if (!adotante){
            var err = {
                code: 401,
                msg: "adotante inexistente"
            }

            throw err
        }

        animal.adotado = true
        await animal.save()

        var adocao = new Adocoes({
            adotante: adotanteId,
            doador: req.data.id,
            animal: animalId
        }).save()

        console.log(`adoção realizada:::${adocao}`)

        res.status(200).send({
            msg: "adocao realizada"
        })


    }catch(e){
        console.log(`erro ao criar registro de adoção de animal::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao criar registro de adoção"
        })
    }
    
})

router.post('/:id', authToken.obrigatorio, async (req, res) => {

    try{

        var animal = await Animais.findOne({_id: req.params.id})
        .populate({
            path: "responsavel",
            select: "_id imagem"
        })
        var me = animal.responsavel._id == req.data.id
        res.status(200).send({
            animal,
            me
        })

    }catch(e){
        console.log(`erro ao requisitar animal:::${e}`)
        res.status(500).send({
            msg: "erro ao encontrar animal"
        })
    }

})




module.exports = router