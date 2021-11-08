/*

    rota: api/user

*/
//dependencias
const express = require('express')
const router = express.Router()

//importando os arquivos de rotas
const cadastrarRouter = require('./cadastro')
const loginRouter = require('./login')
const editRouter = require('./edicao')
const readRouter = require('./requisitar')

//rotas
//raiz
router.get("/", (req, res)=>{
    res.status(200).send({
        msg: "ok"
    })
})

//cadatrar pessoa física
router.use('/login', loginRouter)
router.use('/cadastrar', cadastrarRouter)
router.use('/edit', editRouter)
router.use('/read', readRouter)


//exportação
module.exports = router