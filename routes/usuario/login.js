/**
 * 
 * rota: api/user/login
 * 
*/

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const genToken = require('./../../middlewares/createToken')
const router = express.Router()

require("./../../models/usuarios")

const Usuarios = mongoose.model("usuarios")

router.post('/', (req, res) => {

  var email = req.body.email
  var senha = req.body.senha

  Usuarios.findOne({email: email})
  .then(user => {

    if(!user){
      res.status(401).send({
        msg: "usuário não encontrado"
      })
    }

    // email encontrado
    bcrypt.compare(senha, user.senha, (err, result) => {
      if (err) {
        console.log(`erro ao comparar senhas ::: ${err}`)
        res.status(500).send({
          msg: "erro ao comparar senha com o banco de dados"
        })
      }
      else if(result) {
        
        // * senha correta
        var tokenInfo = {
          id: user._id,
          emal: user.email
        }
        
        var token = genToken(tokenInfo)

        res.status(200).send({
          msg: "usuário logado com sucesso",
          token
        })
        
      }
      else{
        res.status(401).send({
          msg: "senha incorreta"
        })
      }
      

    })
    

  })
  .catch(err => {
    console.error(`erro ao encontrar email no banco de dados :: ${err}`)

    res.status(500).send({
      msg: "erro ao encontrar email no banco de dados"
    })
  })

})



module.exports = router