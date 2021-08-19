//dependencias
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//mongoose models
require('../models/usuarios')
const Usuarios = mongoose.model('usuarios')

//rotas
//raiz
router.get("/", (req, res)=>{
    res.status(200).send({
        msg: "ok"
    })
})

//cadatrar


//exportação
module.exports = router