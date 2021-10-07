const express = require('express')
const router = express.Router()

const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')

require('./../../models/usuarios')
const Usuarios = mongoose.model('usuarios')

//TODO: testar rota
router.post('/user/:tipo',authToken.obrigatorio, async (req, res) => {

  var tipo = req.params.tipo
  var admin
  var resUser

  await Usuarios.findOne({_id: req.data.id})
  .then(user => admin = (user.tipo === "adm") ? user : undefined )
  .catch(e => {
    console.log(`erro ao encontar usuario:::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuário"
    })
  })

  // * verificação de administração
  if(admin){
    // * verificação OK
    await Usuarios.findOne({_id: req.body.id}).populate(tipo)
    // ? .select("")
    .then(user => resUser = (user.tipo === "ong") ? user : undefined)
    .catch(e => {
      console.log(`erro ao encontrar usuário::${e}`)

      res.status(500).send({
        msg: "erro ao encontrar usuário"
      })
    })

  }else{
    console.log("usuário não administrador na rota de administração")

    res.status(401).send({
      msg: "Usuario não é um administrador"
    })
  }

  if(resUser){
    // * tudo ok
    console.log(`ong ${resUser.id} listada pelo admin ${admin.id}`)

    res.status(200).send({ 
      msg : `ong ${resUser.id} listada por um administrador`,
      user: resUser 
    })

  }else{
    console.log("usuário pesquisado não é uma ong")

    res.status(401).send({
      msg: "usuário não é um administrador"
    })
  }

})



module.exports = router