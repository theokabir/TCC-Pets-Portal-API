const express = require('express')
const router = express.Router()

const authToken = require('./../../middlewares/authToken')
const mongoose = require('mongoose')

require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Fisicos = mongoose.model('fisicos')
const Ongs = mongoose.model('ongs')

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

//TODO: melhorar rota de deleção de usuarios
router.post('/delete/:tipo', authToken.obrigatorio, async (req, res) => {

  await Usuarios.findOne({_id: req.data.id})
  .then(admin => {
    if (admin.tipo === "adm"){
      return
    }else{

      console.log(`rota de deleção foi acessada pelo usuário ${admin._id}, não administrador`)

      res.status(401).send({
        msg: "usuário não é um administrador"
      })
    }
  })
  .catch(e => {

    console.log(`erro ao encontrar usuário:::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuário"
    })
  })

  await Usuarios.findOne({_id: req.body.id})
  .then(async user => {
    if (user.tipo === "ong"){

      // * deleção de dado de ong

      await Ongs.deleteOne({_id: user.ong})
      .then(delOng => {

        console.log(`ong ${delOng._id} deletada`)

      })
      .catch(e => {
        console.log(`erro ao deletar dados de ong::::${e}`)

        res.status(500).send({
          msg: "erro ao deletar dados de ong"
        })
      })

    }else if (user.tipo === "nrm"){
    
      // * deleção de dado de pessoa fisica

      await Fisicos.deleteOne({_id: user.fisico})
      .then(delFisico => {

        console.log(`dados de pessoa física ${delFisico._id} deletado`)
        
      })
      .catch(e => {

        console.log(`erro ao deletar dados de pessoa física:::${e}`)

        res.status(500).send({
          msg: "erro ao deletar dados de pessoa física"
        })

      })

    }

    // * deleção de dados gerais

    Usuarios.deleteOne({_id: user._id})
    .then(() => {
      console.log(`usuário ${user._id} deletado`)

      res.status(200).send({
        msg: "usuário deletado com sucesso"
      })
    })
    .catch(e => {

      console.log(`erro ao deletar usuário:::${e}`)

      res.status(500).send({
        msg: "erro ao deletar usuário"
      })
    })
  })
  .catch(e => {

    console.log(`erro ao encontrar usuário para deletar:::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuário para deletar"
    })
  })

})

module.exports = router