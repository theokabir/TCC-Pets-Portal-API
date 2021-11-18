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
            var usuario = await Usuaior.findOne({nome: {$regex: req.body.usuarios, $options: 'i'}})
            query.usuario = usuario._id
        }

        if (req.body.responsavel){
            var usuario = await Usuaior.findOne({nome: {$regex: req.body.responsavel, $options: 'i'}})
            query.usuario = usuario._id
        }

        if (req.body.animal){
            var usuario = await Animais.findOne({nome: {$regex: req.body.animal, $options: 'i'}})
            query.usuario = usuario._id
        }

        var reports = await Reports.find(query)
        .skip(req.body.skip || 0).limit(req.body.limit || 10)



    }catch(e){

    }
})

module.exports = router