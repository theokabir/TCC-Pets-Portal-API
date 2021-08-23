/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const router = express.Router()

//mongoose models
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Fisico = mongoose.model('fisicos')
const Ong = mongoose.model('ongs')

const f = require('./../../functions/f_cadastro.js')

router.post('/', (req, res)=>{
    console.log(f.verificacaoPessoaFisica("djfgdgf"))

    res.send({})
})

//rotas
//cadatrar pessoa física
router.post("/pessoaFisica", (req, res)=>{
    var dataUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        senha2: req.body.senha2,
        endereco: req.body.endereco,
        tel1: req.body.tel1,
        tel2: req.body.tel2,
        nasc: req.body.nasc,
        cpf: req.body.cpf,
        desc: req.body.desc
    }

    var ver = f.verificacaoPessoaFisica(dataUsuario)

    if(ver != false){

        if (typeof(ver) === String) {
            // ?  "conflict"
            res.status(409).send({
                msg: ver
            })
        }
        else {
            // * caso a verificação retorne true

            bcrypt.hash(dataUsuario.senha, 10, (errBcrypt, hash)=>{
                if(errBcrypt){
                    console.log("erro ao encriptar senha")
    
                    res.status(500).send({
                        msg: "erro ao encriptar senha"
                    })
                }
                else{
                    
                    dataUsuario.senha = hash
                    dataUsuario.senha2 = undefined

                    new Fisico(dataUsuario).save()
                    .then(newFisico => {
                        dataUsuario.fisico = newFisico._id
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
                    .catch(e => {
                        console.log(`erro ao criar usuário ${dataUsuario.email} pela tabela d epessoa física::::${e}}`)

                        res.status(500).send({
                            msg: "erro ao criar usuário"
                        })
                    })
                }
            })
                
        }
    } 
    else {

        console.log(`erro: ${ver}`)

        res.status(500).send({
            // TODO: trocar mensagem
            msg: "erro interno do servidor"
        })
    }
    


})

router.post('/ong', (req, res)=>{
    // TODO: Rota de cacadstro de ong
    var dataUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        senha2: req.body.senha2,
        endereco: req.body.endereco,
        tel1: req.body.tel1,
        tel2: req.body.tel2,
        estadoSocial: req.body.estsoci,
        desc: req.body.desc
    }

    var ver = verificacaoOng(dataUsuario)

    if (ver){
        if (typeof(ver) === String){
            res.status(500).send({
                msg: ver
            })
        }else{

            // * Sucesso na verificação

            bcrypt.hash(data.senha, 10, (errBcrypt, hash) => {
                if (errBcrypt){
                    // TODO: Revisar codigo do protocolo HTTP
                    res.status(500).send({
                        msg: "Erro ao encriptar senha"
                    })
                }
                else{

                    dataUsuario.senha = hash
                    dataUsuario.senha2 = undefined
                    dataUsuario.tipo = "ong"

                    new Ong(dataUsuario).save()
                    .then(ong => {

                        dataUsuario.ong = ong._id

                        new Usuarios(dataUsuario).save()
                        .then(user => {
                            // ! remover log
                            console.log(`Usuario registrado::::${user}`)
                            
                            // TODO: Revisar codigo do protocolo HTTP
                            res.status(200).send({
                                msg: "usuario criado com sucesso"
                            })
                        })
                        .catch(e => {
                            // TODO: Revisar codigo do protocolo HTTP
                            res.status(500).send({
                                msg: "Erro ao criar dado do usupario"
                            })
                        })

                    })
                    .catch(e => {
                        // TODO: Revisar codigo do protocolo HTTP
                        res.status(500).send({
                            msg: "Erro ao criar dado do usupario"
                        })
                    })

                }
            })

        }
    }else{
        // TODO: Revisar codigo do protocolo HTTP
        res.status(500).send({
            msg: "Erro ao verificar dados"
        })
    }

})

router.get('/find/:id', (req, res) => {
    var id = req.params.id

    Usuarios.findOne({_id: id})
	.select("-senha -endereco -__v")
    .populate({
		path: "fisico",
		select: "-_id -__v -cpf"
	})
    .populate({
        path: "ong",
        select: "-_id -__v"
    })
    .then(user => {
        console.log(`usuario listado:\n${user}`)
        res.status(200).send(user)
    })
    .catch(err => {
        res.status(200).send({})
    })
})

//exportação
module.exports = router