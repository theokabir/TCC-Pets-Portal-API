const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const fs = require('fs')
const authToken = require("./../../middlewares/authToken")

require('./../../models/animais')
const Animais = mongoose.model("animais")

//TODO: testar rota
router.post("/", authToken.obrigatorio, async (req, res) => {

    try{
        var animal = await Animais.findOne({_id: req.body.animal})
        if (animal.responsavel !== req.data.id){
            var erro = {
                code: 401,
                msg: "usuario não é o responsável pelo animal para excluí-lo"
            }
            throw erro
        }

        fs.unlinkSync(animal.foto)
        await Animais.deleteOne({_id: req.body.animal})
        console.log("animal excluido")
        res.status(200).send({
            msg: "animal excluido com sucesso"
        })

    }catch(e){
        //TODO: erro nas verificações
        console.log(`erro ao tentar excluir dados do animal:::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: e.msg||"erro ao tentar excluir dados do animal"
        })
    }

})

module.exports = router