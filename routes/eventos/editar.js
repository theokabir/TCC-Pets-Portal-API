const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')
const gcs = require('./../../middlewares/gcs')
const upload = require('./../../middlewares/upload')

require('./../../models/eventos')
const Eventos = mongoose.model('eventos')

router.post("/", authToken.obrigatorio, upload.single("banner"), gcs.upload, async (req, res) => {

  var evento
  var oldImage

  try{

    evento = await Eventos.findOne({_id: req.body.evento})

    if (evento.responsavel != req.data.id){
      var err  = {
        code: 401,
        msg: "usuário não p-opde editar este evento"
      }

      throw err
    }

    oldImage = evento.banner || undefined

    evento.nome = req.body.nome
    evento.local = req.body.local
    evento.data = req.body.data
    evento.observacao = req.body.observacao
    evento.especies = req.body.especies
    evento.banner = req.newFile
    evento.editado = true

    var newEvento = await evento.save()
    console.log("editado evento:::\n" + newEvento)
    if (evento.banner)
      gcs.delete(evento.banner.split("/").pop())


    console.log("evento editado")

    res.status(200).send({
      msg: "evento editado"
    })


  }catch(e){

    console.log("erro ao editar evento:: " + e.msg || e)

    if (evento.banner == req.newFile)
      gcs.delete(evento.banner.split("/").pop())
    else
      gcs.delete(oldImage.split("/").pop())

    res.status(e.code || 500).send({
      msg: "erro ao editar evento"
    })

  }

})

module.exports = router