/*

    rota: api/user

*/
//dependencias
const express = require('express')
const router = express.Router()
const cadastrarRouter = require('./cadastro')
const loginRouter = require('./login')

//rotas
//raiz
router.get("/", (req, res)=>{
    res.status(200).send({
        msg: "ok"
    })
})

//cadatrar pessoa física
router.use('/cadastrar', cadastrarRouter)
router.use('/login', loginRouter)


//exportação
module.exports = router