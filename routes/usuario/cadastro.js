/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const upload = require('./../../middlewares/upload')
const router = express.Router()

//mongoose models
require('./../../models/usuarios')
require('./../../models/usuarios_subSchemas/fisico')
require('./../../models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
const Fisico = mongoose.model('fisicos')
const Ong = mongoose.model('ongs')

router.post('/', (req, res)=>{
    res.sendd({msg: "ok"})
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

    if (
        // * verificação dos dados da ong
        dataUsuario.nome &&
        dataUsuario.email &&
        dataUsuario.senha &&
        dataUsuario.endereco &&
        dataUsuario.tel1 &&
        dataUsuario.desc &&
        dataUsuario.senha === dataUsuario.senha2
    ){

        Usuarios.find().or([
            {email: dataUsuario.email},
            {tel1: dataUsuario.tel1},
            {tel2: dataUsuario.tel2}
        ])
        .then(user => {

            if(user.lenght > 0){
                console.log(`Usuário já registrado::::\n${user}`)

                res.status(500).send({
                    msg: "Email ou telefone já existente"
                })
            }   
            else{

                bcrypt.hash(dataUsuario.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt){
                        console.log("Erro ao encriptar senha")

                        res.status(500).send({
                            msg: "Erro ao encriptar dados"
                        })
                    }
                    else{

                        dataUsuario.senha = hash

                        new Fisico(dataUsuario).save()
                        .then(newPessoaFisica=> {

                            dataUsuario.fisico = newPessoaFisica._id

                            new Usuarios(dataUsuario).save()
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

    }
    else{
        console.log("Eroo na verificação dos dados")

        res.status(500).send({
            msg: "Erro na verificação de dados"
        })
    }
    


})

router.post('/ong', upload.single('img'), (req, res)=>{
    // TODO: Rota de cacadstro de ong
    var dataUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        senha2: req.body.senha2,
        endereco: req.body.endereco,
        tel1: req.body.tel1,
        tel2: req.body.tel2,
        desc: req.body.desc
    }

    console.log(`data: ${JSON.stringify(dataUsuario, null, "\t")}\nfile${JSON.stringify(req.file, null, "\t")}`)

    if (
        // * verificação dos dados da ong
        dataUsuario.nome &&
        dataUsuario.email &&
        dataUsuario.senha &&
        dataUsuario.endereco &&
        dataUsuario.tel1 &&
        dataUsuario.desc && 
        dataUsuario.senha === dataUsuario.senha2 &&
        req.file 
        ){

        dataUsuario.estadoSocial = req.file.path

        // TODO: verificação de telefones repetidos
        Usuarios.find().or([
            {email: dataUsuario.email},
            {tel1: dataUsuario.tel1},
            {tel2: dataUsuario.tel2}
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

                bcrypt.hash(dataUsuario.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) {
                        res.status(500).send({
                            msg: "Erro ao encriptar dados"
                        })
                    }
                    else{

                        dataUsuario.senha = hash

                        new Ong(dataUsuario).save()
                        .then(ong => {
                            dataUsuario.tipo = "ong"
                            dataUsuario.ong = ong._id
        
                            new Usuarios(dataUsuario).save()
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
    
    }
    else{
        console.log("erro na verificação dos dados")

        res.status(500).send({
            msg: "erro ao verificar dados"
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
        res.status(200).send({msg: err})
    })
})

//exportação
module.exports = router