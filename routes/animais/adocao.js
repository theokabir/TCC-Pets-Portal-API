const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const authToken = require('./../../middlewares/authToken')

require("./../../models/pedidos")
require("./../../models/adocoes")
require('./../../models/animais')
const Pedidos = mongoose.model('pedidos')
const Adocoes = mongoose.model('adocoes')
const Animais = mongoose.model('animais')

router.post('/pedido', authToken.obrigatorio, async (req, res) => {
    try{

        var pedido ={
            adotante: req.data.id,
            doador: req.body.doador,
            animal: req.body.animal,
            observacao: req.body.observacao,
        }

        var others = Pedidos.find({adotante: pedido.adotante, animal: pedido.animal})

        if (others.length > 0){
            var err = {
                code: 401,
                msg: "pedido  nãao podde ser feito novaamente"
            }

            throw err
        }

        const newPedido = await new Pedidos(pedido).save()

        console.log("pedido criado com sucesso")
        console.log(newPedido)

        res.status(200).send({
            msg: "pedido criado com sucesso"
        })

    }catch(e){
        console.log(`erro ao criar pedido:::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao criar pedido"
        })
    }
})

router.post('/aceitar', authToken.obrigatorio, async (req, res) => {

    try{

        var pedido = await Pedidos.findOne({_id: req.body.pedido})
        var animal = await Animais.findOne({_id: pedido.animal})
        if (pedido.doador != req.data.id){
            var err = {
                code: 401,
                msg: "usuário não é o doador"
            }

            throw err
        }

        pedido.status = "confirmado"
        animal.adotado = true
        var newAdocao ={
            adotante: pedido.adotante,
            doador: pedido.doador,
            animal: pedido.animal
        }

        await animal.save()
        await new Adocoes(newAdocao).save()
        await pedido.save()

        console.log("doação realizada")

        res.status(200).send({
            msg: "doação realizada"
        })

    }catch(e){

        console.log(`erro ao confirmar adoção:::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao confirmar adoção"
        })

    }
    
})

router.post('/recusar',authToken.obrigatorio, async(req, res) => {

    try{

        var pedido = await Pedidos.findOne({_id: req.body.pedido})

        if(pedido.doador != req.data.id){
            var err = {
                code: 401,
                msg: "usuário não é o dono do animal do pedido"
            }
            throw err
        }

        pedido.status = "recusado"

        await pedido.save()

        console.log("pedido recusado")

        res.status(200).send({
            msg: "pedido recusado"
        })

    }catch(e){

        console.log(`erro ao recusar pedido:::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao recusar pedido"
        })

    }

})

router.post('/deletar',authToken.obrigatorio, async (req, res) => {

    try{
        var pedido = await Pedidos.findOne({_id: req.body.pedido})

        if (pedido.adotante != req.data.id){
            var err = {
                code: 401,
                msg: "usuário não é o dono do pedido"
            }
            throw err
        }

        await Pedidos.deleteOne({_id: pedido._id})

        console.log("pedido deletado")

        res.status(200).send({
            msg: "pedido deletado com sucesso"
        })
    }catch(e){
        console.log(`erro ao deletar pedido:::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao deletar pedido"
        })
    }

})

router.post('/aceitos', authToken.obrigatorio, async(req, res) => {
    try{

        var doados = await Pedidos.find({doador: req.data.id, status: "confirmado"})
        .populate({
            path: "adotante",
            select: "_id imagem nome"
        })
        .populate({
            path: "animal",
            select: "_id nome foto"
        })
        .sort({data: -1})

        var adotados = await Pedidos.find({adotante: req.data.id, status: "confirmado"})
        .populate({
            path: "doador",
            select: "_id imagem nome ddd1 ddd2 tel1 tel2"
        })
        .populate({
            path: "animal",
            select:"foto nome"
        })
        .sort({data: -1})

        console.log("pedidos aceitos foram listados")

        res.status(200).send({
            msg: "pedidos listados com sucesso",
            doados,
            adotados
        })
        

    }catch(e){

        console.log(`erro ao listar pedidos aceitos:::${e}`)

        res.status(500).send({
            msg: "erro ao listar pedidos aceitos"
        })

    }
})

router.post("/espera", authToken.obrigatorio, async(req, res)=> {
    try{

        var doados = await Pedidos.find({doador: req.data.id, status: "espera"})
        .select("-status")
        .populate({
            path: "adotante",
            select: "_id imagem nome"
        })
        .populate({
            path: "animal",
            select: "_id nome foto"
        })
        .sort({data: 1})

        var adotados = await Pedidos.find({adotante: req.data.id, status: "espera"})
        .select("-status")
        .populate({
            path: "doador",
            select: "_id imagem"
        })
        .populate({
            path: "animal",
            select:"foto nome"
        })
        .sort({data: 1})

        console.log("pedidos em espera foram listados")

        res.status(200).send({
            msg: "pedidos listados com sucesso",
            doados,
            adotados
        })
        

    }catch(e){

        console.log(`erro ao listar pedidos aceitos:::${e}`)

        res.status(500).send({
            msg: "erro ao listar pedidos aceitos"
        })

    }
})

module.exports = router