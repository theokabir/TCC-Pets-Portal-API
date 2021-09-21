/**
 * 
 * rota: api/user/read
 * 
*/

//express
const express = require('express')
const router = express.Router()

//modals
const mongoose = require('mongoose')
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')

//rotas
router.post('/', (req, res) => {
  var id = req.body.id

  Usuarios.findOne({_id: id})
  .select('nome email imagem tipo')
  .populate({
    path: "fisico",
    select: "desc -_id"
  })
  .populate({
    path: "ong",
    select: "desc -_id"
  })
  .then(user => {
    
    if (user.tipo === "ong" && !user.ong.verificado){
      console.log("ong não verificada")

      res.status(401).send({
        msg: "esta ong não é verificada"
      })
    }
    else {
      console.log(`usuário consultado::${user}`)
      res.status(200).send({
        msg: "usuário consultado com sucesso",
        user: user
      })
    }

  })
  .catch(e => {
    console.log(`erro ao encontrar usuário com id:${id}\nerro::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar suário"
    })
  })

})


//export
module.exports = router