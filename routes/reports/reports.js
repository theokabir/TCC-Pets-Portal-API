const express = require('express')
const router = express.Router()
const criarRouter = require('./criar')

router.use('/criar', criarRouter)


module.exports = router