const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const authToken  = require('./../../middlewares/authToken')

require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model("usuarios")
const Ongs = mongoose.model("ongs")

router.post('/ong', authToken.obrigatorio, async (req, res) => {
  var adminId = req.data.id
  var isAdmin

  await Usuarios.findOne({_id: adminId})
  .then(admin => isAdmin = admin.tipo === "adm")
  .catch(e => {
    console.log(`erro ao encontrar usuário ${adminId} na rota de administração\nerro:${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuario"
    })
  })

  if (isAdmin){
    // * requisição das ongs
    var skip = req.body.skip || 0
    var limit = req.body.limit || 10

    //TODO: refinar busca por ongs
    //TODO: testar
    var findQuery ={
      tipo: "ong"
    }

    Usuarios.find(findQuery).skip(skip).limit(limit).populate('ong')
    .select("nome email senha endereco ddd1 tel1 ddd2 tel2 imagem tipo")
    .then(ongs => {
      res.status(200).send({
        msg: "ongs listadas",
        ongs
      })
    })
    .catch(e => {
      console.log(`erro ao listar ongs na rota de administração:::${e}`)

      res.status(500).send({
        msg: "erro ao encontrar ongs"
      })
    })
  }
  else{
    res.status(401).send({
      msg: "usuário não é um administrador"
    })
  }
})

module.exports = router