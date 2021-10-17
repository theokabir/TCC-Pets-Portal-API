const express = require('express')
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')
const router = express.Router()

require('./../../models/messages')
mongoose.model('mensagens')

router.post('/', authToken.obrigatorio, (req, res) => {
    //TODO: rota de requisição de mensagens
})



module.exports = router