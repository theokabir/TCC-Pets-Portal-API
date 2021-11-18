const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/reports')
require('./../../models/usuarios')
require('./../../models/animais')
const Reports = mongoose.model('reports')
const Usuarios = mongoose.model('usuarios')
const Animais = mongoose.model('animais')

router.post('/', authToken.obrigatorio, async (req, res) => {
    try{

        var admin = await Usuarios.findOne({_id: req.data.id})
        if (admin.tipo != "adm"){
            var err = {
                code: 401,
                msg: "usuario não é administrador para acessar está página"
            }
            throw err
        }

        var query = {}

        if(req.body.usuario){
            var usuario = await Usuaior.find({nome: {$regex: req.body.usuarios, $options: 'i'}})
            var inQuery = []
            for (var i = 0; i < usuario.length; i++){
                inQuery.push(usuario[i]._id)
            }
            query.usuario = {$in: inQuery}
        }

        // if (req.body.responsavel){
        //     var responsavel = await Usuaior.findOne({nome: {$regex: req.body.responsavel, $options: 'i'}})
        //     var inQuery = []
        //     for (var i = 0; i < responsavel.length; i++){
        //         inQuery.push(responsavel[i]._id)
        //     }
        //     query.responsavel = {$in: inQuery}
        // }

        // if (req.body.animal){
        //     var animal = await Animais.findOne({nome: {$regex: req.body.animal, $options: 'i'}})
        //     var inQuery = []
        //     for (var i = 0; i < animal.length; i++){
        //         inQuery.push(animal[i]._id)
        //     }
        //     query.animal = {$in: inQuery}
        // }

        console.log(query)

        var reports = await Reports.find(query)
        .populate({path: 'fonte', select: 'nome'})
        .populate({path: 'usuario', select: 'nome'})
        .populate({path: 'animal', select: 'nome'})
        .skip(req.body.skip || 0).limit(req.body.limit || 10)

        console.log('reports listados pelo administrador')

        res.status(200).send({
            msg: "reports listados com sucesso",
            reports
        })

    }catch(e){

        console.log(`erro ao listar reports:::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao listar reports"
        })

    }
})

module.exports = router