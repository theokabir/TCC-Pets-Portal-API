const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const authToken = require('./../../middlewares/authToken')

require("./../../models/pedidos")
const Pedidos = mongoose.model('pedidos')

router.post('/pedido', authToken.obrigatorio, async (req, res) => {
    try{

        var pedido ={
            adotante: req.data.id,
            doador: req.body.doador,
            animal: req.body.animal,
            observacao: req.body.observacao,
        }

        await new Pedidos(pedido).save()

        console.log("pedido criado com sucesso")

        res.status(200).send({
            msg: "pedido criado com sucesso"
        })

    }catch(e){
        console.log(`erro ao criar pedido:::${e}`)

        res.status(500).send({
            msg: "erro ao criar pedido"
        })
    }
})

router.post('/aceitar', async (req, res) => {

})

router.post('/recusar', async(req, res) => {

})

router.post('/deletar', async (req, res) => {

})

module.exports = router