/**
 * 
 * rota: api/admin/
 * 
*/

const express = require('express')
const router = express.Router()

const listRouter = require('./list')
const showRouter = require('./show')

router.use("/list",listRouter)
router.use("/show", showRouter)

module.exports = router