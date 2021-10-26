const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const authToken = require('./../../middlewares/authToken')
const fs = require('fs')

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
    await fs.unlink(evento.bunner, (err) => {if (err) throw err})

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