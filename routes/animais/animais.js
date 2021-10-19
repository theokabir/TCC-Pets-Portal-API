const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require("./../../middlewares/authToken")

require('./../../models/animais')
require('./../../models/messages')
const Mensagens = mongoose.model('mensagens')
const Animais = mongoose.model('animais')

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