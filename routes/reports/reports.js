const express = require('express')
const router = express.Router()

const criarRouter = require('./criar')
const banirRouter  = require('./banir')

router.use('/criar', criarRouter)
router.use('/banir', banirRouter)


module.exports = router