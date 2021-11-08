const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require("./../../middlewares/authToken")

require('./../../models/animais')
require('./../../models/adocoes')
require('./../../models/usuarios')
const Animais = mongoose.model('animais')
const Usuarios = mongoose.model('usuarios')
const Adocoes = mongoose.model('adocoes')

const cadastroRouter = require('./cadastro')
const edicaoRouter = require('./edicao')
const deleteRouter = require('./delete')
const adocaoRouter = require('./adocao')

router.use("/cadastro", cadastroRouter)
router.use("/edit", edicaoRouter)
router.use("/delete", deleteRouter)
router.use("/adocao", adocaoRouter)

//TODO: testar rota
// ? rota com login obrigatorio
router.post('/', authToken.obrigatorio, (req, res) => {
    //TODO: rota de pesquisa
})

router.post('/:id', authToken.obrigatorio, async (req, res) => {

    try{

        var animal = await Animais.findOne({_id: req.params.id})
        .populate({
            path: "responsavel",
            select: "_id imagem"
        })
        var me = animal.responsavel._id == req.data.id
        if (me){
            //TODO: edição de pedidos
        }
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