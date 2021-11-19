const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validations = require('./../../middlewares/validations')

require('./../../models/usuarios')
const Usuarios = mongoose.model('usuarios')

router.post('/get', async (req, res) => {
  try{

    var usuario = await Usuarios.findOne({email: req.body.email}).select('pergunta ')
    if (!usuario){
      var err = {
        code: 401,
        msg: "usuário não encontrado"
      }

      throw err
    }

    console.log('pergunta de recuperação acessada')

    res.status(200).send({
      msg: "pergunta de recuperação acessada",
      pergunta: usuario.pergunta,
      usuario: usuario._id,
      ok: true
    })

  }catch(e){

    console.log(`erro ao encontrar pergunta de recuperação::::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: "erro ao encontrar pergunta de recuperação",
      ok: false
    })

  }
})

router.post('/verify', async (req, res) => {
  try{
    var usuario = await Usuarios.findOne({_id: req.body.usuario}).select('resposta')
    if (!usuario){
      var err = {
        code: 401,
        msg: "usuário não encontrado"
      }

      throw err
    }
    if(await bcrypt.compareSync(req.body.resposta, usuario.resposta)){

      console.log('pergunta respondida com sucesso')

      res.status(200).send({
        msg: "pergunta respondida com sucesso",
        ok: true
      })

    }else{
      var err = {
        code: 401,
        msg: "pergunta respondida incorretamente"
      }
      throw err
    }
  }catch(e){
    console.log(`erro ao responder pergunta:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: e.msg || "erro ao responder pergunta",
      ok: false
    })
  }
})

router.post('/redefinir', async (req, res) => {
  try{
    var usuario = await Usuarios.findOne({_id: req.body.usuario}).select('+resposta')
    if (!usuario){
      var err = {
        code: 401,
        msg: "usuário não encontrado"
      }

      throw err
    }
    if(await bcrypt.compareSync(req.body.resposta, usuario.resposta)){

      if(req.body.senha !== req.body.senha2){
        var err = {
          code: 401,
          msg: "senhas não são compativeis"
        }
        throw err
      }else if(!validations.senha(req.body.senha)){

        var err = {
          code: 401,
          msg: "senha não atende aos requisitos para ser utilizada"
        }
        throw err

      }else{

        usuario.senha = await bcrypt.hashSync(req.body.senha, 10)
        await usuario.save()

        console.log('senha alterada com sucesso')

        res.status(200).send({
          msg: "senha alterada com sucesso"
        })

      }

      // console.log('pergunta respondida com sucesso')

      // res.status(200).send({
      //   msg: "pergunta respondida com sucesso",
      //   ok: true
      // })

    }else{
      var err = {
        code: 401,
        msg: "pergunta respondida incorretamente"
      }
      throw err
    }
  }catch(e){
    console.log(`erro ao responder pergunta:::${e.msg || e}`)

    res.status(e.code || 500).send({
      msg: e.msg || "erro ao responder pergunta",
      ok: false
    })
  }
  
})

module.exports = router