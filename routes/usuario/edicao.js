/**
 * 
 * rota: api/user/edit/
 * 
*/

// express
const express = require("express")
const router = express.Router()

//models
const mongoose = require('mongoose')
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
const Usuarios = mongoose.model('usuarios')
const Fisicos = mongoose.model('fisicos')


router.get('/', (req, res) => {
  res.send({
    msg: "Ta funcionando"
  })
})

router.post('/pessoaFisica', (req, res) => {
  var userData = {
    id: req.body.id,
    nome: req.body.nome,
    email: req.body.email,
    endereco: req.body.endereco,
    tel1: req.body.tel1,
    tel2: req.body.tel2,
    nasc: req.body.nasc,
    cpf: req.body.cpf,
    desc: req.body.desc
  }

  Usuarios.findOne({_id: userData.id})
  .then(user => {

    if(user.tipo === "ong"){
      console.log(`entrada de ong na edição de pessoa física`)
      res.status(401).send({
        msg: "está rota é apenas para edição de usuário do tipo \"Pessoa Física\""
      })
    }
    
    Fisicos.findOne({_id: user.fisico})
    .then(fis => {

      // * Dados consultados com sucesso
      if (userData.nome) user.nome = userData.nome
      if (userData.email) user.email = userData.email
      if (userData.endereco) user.endereco = userData.endereco
      if (userData.tel1) user.tel1 = userData.tel1
      if (userData.tel2) user.tel2 = userData.tel2
      
      user.save()
      .then(newUser => {

        console.log(`usuário editado\n${newUser}`)

        if (userData.cpf) fis.cpf = userData.cpf
        if (userData.nasc) fis.nasc = userData.nasc
        if (userData.desc) fis.desc = userData.desc

        fis.save()
        .then(newFis => {

          // * atualizaçãoc completa

          console.log(`dados de pessoa física atualizado\n${newFis}`)

          res.status(200).send({
            msg: "dados alterados com sucesso"
          })

        })
        .catch (e => {
          console.log(`erro ao salvar novos dados de pessoa física:::${e}`)

          res.status(500).send({
            msg: "erro ao salvar novos dados de pessoa física"
          })
        })

      })
      .catch( e => {
        console.log(`erro eo editar Usuario\nerro:::${e}`)

        res.status(500).send({
          msg: "erro ao editar usuário"
        })

      })


    })
    .catch(e => {
      console.log(`erro ao encontrrar dados de pessoa física com o id:${user.fisico}\nerro:::${e}`)

      res.status(500).send({
        msg: "erro ao encontrar dados de pessoa física"
      })
    })

  })
  .catch( e => {

    console.log(`erro ao encontrar usuario como id ${userData.id}\nerro:::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuário com tal id"
    })
  })

})

router.post('/pessoaFisica/senha', (req, res) => {

})

router.post('/pessoaFisica/foto', (req, res) => {

})

router.post('/ong', (req, res) => {

})

router.post('/ong/senha', (req, res) => {

})

router.post('/ong/foto', (req, res) => {

})


module.exports = router