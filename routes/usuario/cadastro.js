/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const router = express.Router()

//mongoose models
require('./../../models/usuarios')
const Usuarios = mongoose.model('usuarios')

//funções de verificação
const verificacaoPessoaFisica = (data) => {
    if (
        data.nome &&
        data.email &&
        data.senha &&
        data.endereco &&
        data.tel1 &&
        data.nasc &&
        data.cpf
    ){

        Usuarios.findOne({email: data.email})
        .then(user => {
            if(user){
                return "Usuário ja existente"
            } 
            else {
                return true
            }
        })
        .catch(err => {
            return false
        })

    }else{
        // TODO: revisar mensagem
        return "Falta de dados obrigatórios"
    }
}

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

    var ver = verificacaoPessoaFisica(dataUsuario)

    if(ver){

        if (typeof(ver) === String) {
            // ?  "conflict"
            res.status(409).send({
                msg: ver
            })
        }
        else {
            // * caso a verificação retorne true

            bcrypt.hash(dataUsuario.senha, 10, (errBcrypt, hash)=>{
                if (errBcrypt){

                    console.log("erro ao encriptar senha")

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


    } 
    else {

        console.log("erro ao ")

        res.status(500).send({
            // TODO: trocar mensagem
            msg: "erro interno do servidor"
        })
    }
    


})


//exportação
module.exports = router