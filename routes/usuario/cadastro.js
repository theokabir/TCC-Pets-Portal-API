/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uploadOng = require('./../../middlewares/uploadOng')
const router = express.Router()

//mongoose models
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Fisico = mongoose.model('fisicos')
const Ong = mongoose.model('ongs')

//middlewares
const verifPessoaFisica = require('./../../middlewares/cadastro/verifPessoaFisica')
const verifOng = require('./../../middlewares/cadastro/verifOng')

router.post('/', (req, res)=>{
    res.sendd({msg: "ok"})
})

//rotas
//cadatrar pessoa física
router.post("/pessoaFisica",verifPessoaFisica, (req, res)=>{

    Usuarios.find().or([
        {email: req.newUser.email},
        {tel1: req.newUser.tel1},
        {tel2: req.newUser.tel2}
    ])
    .then(user => {

        if(user.lenght > 0){
            console.log(`Usuário já registrado::::\n${user}`)

            res.status(500).send({
                msg: "Email ou telefone já existente"
            })
        }   
        else{

            bcrypt.hash(req.newUser.senha, 10, (errBcrypt, hash) => {
                if (errBcrypt){
                    console.log("Erro ao encriptar senha")

                    res.status(500).send({
                        msg: "Erro ao encriptar dados"
                    })
                }
                else{

                    req.newUser.senha = hash

                    new Fisico(req.newUser).save()
                    .then(newPessoaFisica=> {

                        req.newUser.fisico = newPessoaFisica._id

                        new Usuarios(req.newUser).save()
                        .then(newPessoa => {
                            console.log(`Novo usuário criado::::\n${newPessoa}`)

                            res.status(200).send({
                                msg: "Novo usuário criado"
                            })
                        })
                        .catch(e => {
                            console.log(`Erro ao criar dado do usuário:::::\n${e}`)

                            res.status(500).send({
                                msg: "Erro ao criar dado do usuário"
                            })
                        })

                    })
                    .catch(e => {
                        console.log(`Erro ao criar dado de pesssoa física::::\n${e}`)

                        res.status(500).send({
                            msg: "erro ao criar usuário de pessoa física"
                        })
                    })

                }
            })

        }

    })
    .catch(e => {
        console.log(`Erro ao verificar existencia de usuário:::\n${e}`)

        res.status(500).send({
            msg: "Erro ao encontrar usuário já existente"
        })
        })
    


})

router.post('/ong', uploadOng.single('social'), verifOng,(req, res)=>{

    req.newUser.estadoSocial = req.file.path
    Usuarios.find().or([
        {email: req.newUser.email},
        {tel1: req.newUser.tel1},
        {tel2: req.newUser.tel2}
    ])
    .then(user => {

        if(user.length > 0){
            console.log(`Usuário já registrado:: ${user}`)

            res.status(401).send({
                msg: "Usuário já registrado com esse email"
            })
        }
        else{
            // * sucesso na verificação dos dados

            bcrypt.hash(req.newUser.senha, 10, (errBcrypt, hash) => {
                if (errBcrypt) {
                    res.status(500).send({
                        msg: "Erro ao encriptar dados"
                    })
                }
                else{

                    req.newUser.senha = hash

                    new Ong(req.newUser).save()
                    .then(ong => {
                        req.newUser.tipo = "ong"
                        req.newUser.ong = ong._id
    
                        new Usuarios(req.newUser).save()
                        .then(newUser => {
    
                            // * sucesso na criação do usuário ONG
                            console.log(`Novo usuário criado::::${newUser}`)
    
                            res.status(200).send({
                                msg: "usuário criado com sucesso"
                            })
    
                        })
                        .catch(e => {
                            console.log(`Erro na criação do dado do usuário:::\n${e}`)
    
                            res.status(500).send({
                                msg: "Erro na criação do dado do novo usuário"
                            })
                        })
    
                    })
                    .catch(e => {
                        console.log(`Erro ao criar dado da ONG::\n${e}`)
    
                        res.status(500).send({
                            msg: "erro ao criar dado da ong"
                        })
                    })
                }
            })
        }
    })
    .catch(e => {
        console.log(`Erro ao encontrar usuários com o mesmo email:::\n${e}`)

        res.status(500).send({
            msg: "Erro ao encontrar usuários com o mesmo email"
        })
    })
            

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
        res.status(200).send({msg: err})
    })
})

//exportação
module.exports = router