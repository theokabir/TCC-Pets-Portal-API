/**
 * 
 * rota: api/user/edit/
 * 
*/

// express
const express = require("express")
const router = express.Router()

// outras dependencias
const bcrypt = require('bcrypt')
const fs = require('fs')

//models
const mongoose = require('mongoose')
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Fisicos = mongoose.model('fisicos')
const Ongs = mongoose.model('ongs')

//middlewares
const authToken = require('./../../middlewares/authToken')
const upload = require('./../../middlewares/upload')


router.get('/', (req, res) => {
  res.send({
    msg: "Ta funcionando"
  })
})

router.post('/pessoaFisica',authToken.obrigatorio, (req, res) => {
  var userData = {
    id: req.data.id,
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
        msg: "está rota é apenas para edição de usuário do tipo 'Pessoa Física'"
      })
    }else{
      Fisicos.findOne({_id: user.fisico})
      .then(fis => {
  
        // * Dados consultados com sucesso
        if (userData.nome) user.nome = userData.nome
        if (userData.email) user.email = userData.email
        if (userData.endereco) user.endereco = userData.endereco
        if (userData.tel1) {
          user.tel1 = userData.tel1.slice(2)
          user.ddd1 = userData.tel1.slice(0,2)
        }
        if (userData.tel2) {
          user.tel2 = userData.tel2.slice(2)
          user.ddd2 = userData.tel2.slice(0,2)
        }
        
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
    }

  })
  .catch( e => {

    console.log(`erro ao encontrar usuario como id ${userData.id}\nerro:::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuário com tal id"
    })
  })
    

})

router.post('/ong',authToken.obrigatorio, (req, res) => {

  var dataUsuario = {
    id: req.data.id,
    nome: req.body.nome,
    email: req.body.email,
    endereco: req.body.endereco,
    tel1: req.body.tel1,
    tel2: req.body.tel2,
    desc: req.body.desc
  }

  Usuarios.findOne({_id: dataUsuario.id})
  .then(user => {

    console.log(user)

    if (user.tipo === "nrm"){

        console.log("esta rota é apenas para usuários do tipo 'ong'")

        res.status(4501).send({
          msg:"Essa rota é usada apenas para usuarios do tipo 'ong'"
        })

    }else{
      Ongs.findOne({_id: user.ong})
      .then(ong => {
  
        // * Dados consultados com sucesso
        if (dataUsuario.nome) user.nome = dataUsuario.nome
        if (dataUsuario.email) user.email = dataUsuario.email
        if (dataUsuario.endereco) user.endereco = dataUsuario.endereco
        if (dataUsuario.tel1) {
          user.tel1 = dataUsuario.tel1.slice(2)
          user.ddd1 = dataUsuario.tel1.slice(0,2)
        }
        if (dataUsuario.tel2) {
          user.tel2 = dataUsuario.tel2.slice(2)
          user.ddd2 = dataUsuario.tel2.slice(0,2)
        }

        user.save()
        .then(newUser => {

          console.log(`usuário editado:::${newUser}`)

          if (dataUsuario.desc) {
            console.log(ong)
            ong.desc = dataUsuario.desc

            ong.save()
            .then(newOng => {

              // * sucesso na edição
              console.log(`dados de ong editados:::${newOng}`)

              res.status(200).send({
                msg: "dados editados com sucesso"
              })

            })
            .catch(e => {
              
              console.log(`erro ao editar dados da ong:::${e}`)

              res.status(500).send({
                msg: "erro ao editar dados da ong"
              })

            })
          }else{
            res.status(200).send({
              msg: "dados editados com sucesso"
            })
          }

        })
        .catch(e => {
          console.log(`erro ao editar dados da ong:::${e}`)

          res.status(500).send({
            msg: "erro ao editar dados da ong"
          })
        })

      })
      .catch(e => {
        console.log(`erro ao encontrar dados de ong com o id ${user.ong}\nerro:::${e}`)

        res.status(500).send({
          msg: "erro ao encontrar dados de ong do usuário"
        })
      })
    }
  })
  .catch(e => {
      console.log(`erro ao encontrar usuário com o id ${dataUsuario.id}\nerro:::${e}`)

      res.status(500).send({
        msg: "erro ao encontrar usuário"
      })
  })

})

router.post('/senha',authToken.obrigatorio, (req, res) => {
  var dataUsuario = {
    id: req.data.id,
    nSenha: req.body.nSenha,
    nSenha2: req.body.nSenha2
  }

  if (dataUsuario.nSenha !== dataUsuario.nSenha2
    || !dataUsuario.nSenha
    || !dataUsuario.nSenha2){

    console.log(`Senhas não são compativeis ou inexistentes`)

    res.status(401).send({
      msg: "Senhas não são compativeis ou inexistentes"
    })

  }else{

    Usuarios.findOne({_id: dataUsuario.id})
    .then(user => {

      bcrypt.hash(dataUsuario.nSenha, 10, (errBcrypt, hash) => {
        if(errBcrypt){
          console.log(`erro ao encriptar nova senha:::${errBcrypt}`)

          res.status(500).send({
            msg: "erro ao encriptar senha"
          })
        }else{
          user.senha = hash

          user.save()
          .then(newUser => {
            console.log(`nova senha do usuário ${newUser._id} salva com sucesso`)

            res.status(200).send({
              mag: "senha salva com sucesso"
            })
          })
          .catch(e => {
            console.log(`erro ao salvar senha de novo usuário:::${e}`)

            res.status(500).send({
              msg: "Houve um erro ao salvar a nova senha"
            })
          })
        }
      })

    })
    .catch(e => {
      console.log(`erro ao encontrar usuário com o id ${dataUsuario.id}\nerro:::${e}`)

      res.status(500).send({
        msg: "erro ao encontrar usuário"
      })
    })

  }
})

router.post('/foto',authToken.obrigatorio, upload.single("img"), (req, res) => {
  var foto = req.file.path

  Usuarios.findOne({_id: req.data.id})
  .then(user => {

    if(user.imagem){
      try{
        fs.unlink(user.imagem, err => {
          if (err){
            console.log(`erro ao deletar imagem já existente:::${err}`)

            res.status(500).send({
              msg: "erro ao deletar imagem já existente"
            })
          }else{
            console.log("imagem deletada com sucesso")
          }
        })
      }catch (err) {
        console.log("erro ao deletar imagem já existente")

        res.status(500).send({
          msg: "erro ao deletar imagem já existente"
        })
      }
    }

    user.imagem = foto

    user.save()
    .then(newUser => {
      
      console.log(`usuário salvo com sucesso\nusuário::${newUser._id}`)

      res.status(200).send({
        msg: "foto salva com sucesso"
      })

    })
    .catch(e => {
      console.log(`Erro ao salvar usuário::::${e}`)

      res.status(500).send({
        msg: "erro ao salvar usuário"
      })
    })

  })
  .catch(e => {
    console.log(`erro ao encontrar usuário comm o id ${req.data.id}\nerro:::${e}`)

    res.status(500).send({
      msg: "erro ao encontrar usuário"
    })
  })

})


module.exports = router