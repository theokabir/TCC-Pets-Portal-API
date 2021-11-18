/**
 * 
 * rota: api/admin/
 * 
*/

const express = require('express')
const router = express.Router()

const validateOngRouter = require('./validOng')
const adocoesRouter = require('./listAdocoes')
const validEventosRouter = require('./validEvento')
const reportsRouter = require('./listReports')

router.use('/validate/ong', validateOngRouter)
router.use('/validate/eventos', validEventosRouter)
router.use('/adocoes', adocoesRouter)
router.use('/reports', reportsRouter)

module.exports = router