//TODO: testar google cloud
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const authToken = require('./../../middlewares/authToken')
const gcs = require('./../../middlewares/gcs')

require('./../../models/eventos')
const Eventos = mongoose.model("eventos")

router.post("/", authToken.obrigatorio, async (req, res) => {

  try{

    var evento = await Eventos.findOne({_id: req.body.evento}).select('_id responsavel')
    if (evento.responsavel != req.data.id){
      var err = {
        code: 401,
        msg: "usuario não é o responsavel pelo evento"
      }

      throw err
    }

    await Eventos.deleteOne({_id: evento._id})
    gcs.delete(evento.banner)

    console.log("evento deletado")

    res.status(200).send({
      msg: "evento deletado com sucesso"
    })


  }catch(e){
    console.log('erro ao deletar uevento::' + e.msg || e)

    res.status(e.code || 500).send({
      msg: "erro ao deletar evento"
    })
  }

})

module.exports = router