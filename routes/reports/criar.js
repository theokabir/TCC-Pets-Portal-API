const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose  = require('mongoose')

require('./../../models/reports')
const Reports = mongoose.model('reports')

router.post('/',authToken.obrigatorio, async (req, res) => {

    try{

        var report = {
            fonte: req.readableAborted.id,
            usuario: req.body.usuario,
            texto: req.body.texto
        }

        if(req.body.animal)
            report.animal = req.body.animal

        var preReports = await Reports.find({usuario: report.usuario}).count()
        report.count = preReports + 1

        const newReport = await new Reports(report).save()

        console.log(`report feito com sucesso:::${newReport}`)

        res.status(200).send({
            msg: "report feito com sucesso"
        })

    }catch(e){

        console.log(`erro ao criar report`)

        res.status(500).send({
            msg: "erro ao criar report"
        })

    }

})

module.exports = router