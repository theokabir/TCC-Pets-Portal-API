//TODO: testar cadastro de ong
/*

    rota: api/user/cadastrar

*/

//dependencias
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uploadOng = require('./../../middlewares/uploadOng')
const gcs = require('./../../middlewares/gcs')
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
router.post("/pessoaFisica",verifPessoaFisica, async (req, res)=>{

    Usuarios.find().or([
        {email: req.newUser.email},
        {tel1: req.newUser.tel1},
        {tel2: req.newUser.tel2}
    ])
    .then(async user => {

        if(user.lenght > 0){
            console.log(`Usuário já registrado::::\n${user}`)

            res.status(500).send({
                msg: "Email ou telefone já existente"
            })
        }   
        else{

            bcrypt.hash(req.newUser.senha, 10, async (errBcrypt, hash) => {
                if (errBcrypt){
                    console.log("Erro ao encriptar senha")

                    res.status(500).send({
                        msg: "Erro ao encriptar dados"
                    })
                }
                else{

                    bcrypt.hash(req.newUser.resposta, 10, async (errBcrypt2, hash2) => {

                        if(errBcrypt2){
                            console.log("Erro ao encriptar resposta de pergunta de recuperação")

                            res.status(500).send({
                                msg: "Erro ao encriptar dados"
                            })
                        }else{
                            req.newUser.senha = hash
                            req.newUser.resposta = hash2
        
                            var fisico, newUser
        
                            try {
        
                                fisico = await new Fisico(req.newUser).save()
                                req.newUser.fisico = fisico._id
                                newUser = await new Usuarios(req.newUser).save()
        
                                console.log(`Novo usuário criado::::\n${newUser}`)
        
                                res.status(200).send({
                                    msg: "Novo usuário criado"
                                })
        
                            }catch(e){
        
                                try{
                                    Fisico.deleteOne({_id: fisico._id})
                                    Usuarios.deleteOne({_id: newUser._id})
                                }catch(e){
        
                                }
        
                                console.log(`erro ao criar usuário:::${e}`)
        
                                res.status(500).send({
                                    msg: "erro ao criar usuário de pessoa física"
                                })
                            }
                        }

                    })

                }

                    // new Fisico(req.newUser).save()
                    // .then(newPessoaFisica=> {

                    //     req.newUser.fisico = newPessoaFisica._id

                    //     new Usuarios(req.newUser).save()
                    //     .then(newPessoa => {
                    //         console.log(`Novo usuário criado::::\n${newPessoa}`)

                    //         res.status(200).send({
                    //             msg: "Novo usuário criado"
                    //         })
                    //     })
                    //     .catch(e => {
                    //         console.log(`Erro ao criar dado do usuário:::::\n${e}`)

                    //         res.status(500).send({
                    //             msg: "Erro ao criar dado do usuário"
                    //         })
                    //     })

                    // })
                    // .catch(e => {
                    //     console.log(`Erro ao criar dado de pesssoa física::::\n${e}`)

                    //     res.status(500).send({
                    //         msg: "erro ao criar usuário de pessoa física"
                    //     })
                    // })

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

router.post('/ong', uploadOng.single('social'), gcs.upload, verifOng, async (req, res)=>{

    req.newUser.estadoSocial = req.newFile
    Usuarios.find().or([
        {email: req.newUser.email},
        {tel1: req.newUser.tel1},
        {tel2: req.newUser.tel2}
    ])
    .then(async user => {

        if(user.length > 0){
            console.log(`Usuário já registrado:: ${user}`)

            res.status(401).send({
                msg: "Usuário já registrado com esse email"
            })
        }
        else{
            // * sucesso na verificação dos dados

            bcrypt.hash(req.newUser.senha, 10, async (errBcrypt, hash) => {
                if (errBcrypt) {
                    res.status(500).send({
                        msg: "Erro ao encriptar dados"
                    })
                }
                else{

                    var newResposta = await bcrypt.hashSync(req.newUser.resposta, 10)

                    req.newUser.senha = hash
                    req.newUser.resposta = newResposta

                    new Ong(req.newUser).save()
                    .then(async ong => {
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

        gcs.delete(req.newFile)

        res.status(500).send({
            msg: "Erro ao encontrar usuários com o mesmo email"
        })
    })
            

})

//exportação
module.exports = router