/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const router = express.Router()

//mongoose models
require('../models/usuarios')
const Usuarios = mongoose.model('usuarios')

//rotas
//cadatrar pessoa física
router.post("/pessoaFisica", (req, res)=>{
    var dataUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        endereco: req.body.endereco,
        tel1: req.body.tel1,
        tel2: req.body.tel2,
        nasc: req.body.nasc,
        cpf: req.body.cpf,
        desc: req.body.desc
    }

    Usuarios.findOne({email: dataUsuario.email})
    .then(data => {
        if(data){
            console.log(`este email já está registrado`)

            res.status(401).send({
                msg: "email já registrado"
            })
        }else{
            bcrypt.hash(dataUsuario.senha, 10, (errBcrypt, hash)=>{
                if (errBcrypt){
                    res.status(500).send({
                        msg: "erro ao encriptar senha"
                    })
                }

                dataUsuario.senha = hash

                new Usuarios(dataUsuario).save()
                .then(newUser => {
                    console.log(`novo usuário registrado:\n${newUser}`)

                    res.status(200).send({
                        msg: "usuário criado com sucesso"
                    })
                })
                .catch(e => {
                    console.log(`erro ao criar usuário ${dataUsuario.email}::::${e}}`)

                    res.status(500).send({
                        msg: "erro ao criar usuário"
                    })
                })  
            })
        }
    })
    .catch(err => {
        console.log(`erro ao procurar por dados:::::${err}`)

        res.status(500).send({
            msg: "erro ao encontrar dados"
        })
    })


})


//exportação
module.exports = router