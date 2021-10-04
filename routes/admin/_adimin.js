/**
 * 
 * rota: api/admin/
 * 
*/

const express = require('express')
const router = express.Router()

const listRouter = require('./list')

router.use("/list",listRouter)

module.exports = router