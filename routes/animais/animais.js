const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const authToken = require("./../../middlewares/authToken")

require('./../../models/animais')
const Mensagens = mongoose.model('mensagens')

const cadastroRouter = require('./cadastro')
const edicaoRouter = require('./edicao')
const deleteRouter = require('./delete')

router.use("/cadastro", cadastroRouter)
router.use("/edit", edicaoRouter)
router.use("/delete", deleteRouter)

//TODO: testar rota
// ? rota com login obrigatorio
router.get('/', authToken.obrigatorio, (req, res) => {
    //TODO: rota de pesquisa
})




module.exports = router