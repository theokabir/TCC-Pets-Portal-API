const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose  = require('mongoose')

require('./../../models/reports')
const Reports = mongoose.model('reports')

router.post('/',authToken.obrigatorio, async (req, res) => {

    try{

        var report = {
            fonte: req.data.id,
            usuario: req.body.usuario,
            texto: req.body.texto
        }

        if(req.body.animal)
            report.animal = req.body.animal

        var preReports = await Reports.find({usuario: report.usuario}).count()
        report.contagem = preReports + 1

        var preReportsFonte = await Reports.find({fonte: req.data.id}).count()
        if(preReportsFonte > 0){
            var err = {
                code: 401,
                msg: "usuário já reportou essa conta"
            }

            throw err
        }

        const newReport = await new Reports(report).save()

        console.log(`report feito com sucesso:::${newReport}`)

        res.status(200).send({
            msg: "report feito com sucesso"
        })

    }catch(e){

        console.log(`erro ao criar report::${e.msg || e}`)

        res.status(e.code || 500).send({
            msg: "erro ao criar report"
        })

    }

})

module.exports = router