/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//mongoose models
require('./../../models/usuarios')
const Usuarios = mongoose.model('usuarios')

// * arquivo de funções
require('./../../functions/f_cadastro')

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

            var novaSenha = hashSenha(dataUsuario.senha)
            if (!novaSenha){
                console.log("erro ao encriptar senha")
    
                res.status(500).send({
                    msg: "erro ao encriptar senha"
                })
            }
            else {
                dataUsuario.senha = novaSenha
    
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
            } 
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