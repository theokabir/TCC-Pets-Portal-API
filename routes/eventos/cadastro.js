//TODO: testar google cloud
const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const authToken = require('./../../middlewares/authToken')
const upload = require('./../../middlewares/upload')
const gcs = require('./../../middlewares/gcs')

require("./../../models/usuarios")
require('./../../models/eventos')
const Usuarios = mongoose.model("usuarios")
const Eventos = mongoose.model("eventos")

router.post("/",upload.single("banner"), gcs.upload, authToken.obrigatorio, async (req, res) => {

  console.log("body:::::::::::::::::::::::::::::::::::::::::::::::::")
  console.log(req.body)
  console.log("body:::::::::::::::::::::::::::::::::::::::::::::::::")

  try{
    var user = await Usuarios.findOne({_id: req.data.id}).populate("ong")
    if (!user.ong || !user.ong.verificado){
      var err = {
        msg: "usuario não valido",
        code: 401
      }

      throw err
    }
    var newEvento = {
      nome: req.body.nome,
      responsavel: req.data.id,
      contato: user.email,
      local: req.body.local,
      data: req.body.data,
      observacao: req.body.observacao,
      especies: req.body.especies,
      banner: req.newFile
    }

    var evento = await new Eventos(newEvento).save()
    console.log(`novo evento registrado::${JSON.stringify(evento)}`)

    res.status(200).send({
      msg: "evento criado com sucesso"
    })

  }catch(e){
    
    gcs.delete(req.newFile)

    console.log("erro ao criar evento:: " + (e.msg ||  e) )

    res.status(e.code || 500).send({
      msg: "erro ao criar evento: "
    })
  }

})

module.exports = router