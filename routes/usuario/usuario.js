/*

    rota: api/user

*/
//dependencias
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const cadastrarRouter = require('./cadastro')

//rotas
//raiz
router.get("/", (req, res)=>{
    res.status(200).send({
        msg: "ok"
    })
})

//cadatrar pessoa física
router.use('/cadastrar', cadastrarRouter)


//exportação
module.exports = router