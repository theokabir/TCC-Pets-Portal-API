const express = require('express')
const router = express.Router()
const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')
const gcs = require('./../../middlewares/gcs')
const upload = require('./../../middlewares/upload')

require('./../../models/eventos')
const Eventos = mongoose.model('eventos')

router.post("/", authToken.obrigatorio, async (req, res) => {

  var evento
  console.log(req.body)
  console.log(req.headers)

  try{

    evento = await Eventos.findOne({_id: req.body.evento})

    if (evento.responsavel != req.data.id){
      var err  = {
        code: 401,
        msg: "usuário não p-opde editar este evento"
      }

      throw err
    }

    evento.nome = req.body.nome
    evento.local = req.body.local
    evento.data = req.body.data
    evento.observacao = req.body.observacao
    evento.especies = req.body.especies
    evento.editado = true

    var newEvento = await evento.save()
    console.log("editado evento:::\n" + newEvento)


    console.log("evento editado")

    res.status(200).send({
      msg: "evento editado"
    })


  }catch(e){

    console.log("erro ao editar evento:: " + e)

    res.status(e.code || 500).send({
      msg: "erro ao editar evento"
    })

  }

})

router.post("/foto", authToken.obrigatorio, upload.single("banner"), gcs.upload, async (req, res) => {

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

    oldImage = evento.banner.split("/").pop()
    evento.banner = req.newFile
    await evento.save()
    gcs.delete(oldImage)

    console.log("imagem editada com sucesso")

    res.status(200).send({
      msg: "imagem editada com sucesso"
    })

  }catch(e){
    console.log("erro ao editar imagem do evento:: " + e.msg || e)

    res.status(e.code || 500).send({
      msg: "erro ao editar imagem do evento"
    })
  }

})

module.exports = router