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
const Fisicos = mongoose.model('fisicos')
const Ongs = mongoose.model('ongs')

//middlewares
const verifPessoaFisica = require('./../../middlewares/cadastro/verifPessoaFisica')
const verifOng = require('./../../middlewares/cadastro/verifOng')

router.post('/', (req, res)=>{
    res.sendd({msg: "ok"})
})

//rotas
//cadatrar pessoa física
router.post("/pessoaFisica",verifPessoaFisica, async (req, res)=>{

    try{
        console.log("1")
        var other = await Usuarios.find({
            $or: [
                {email: req.newUser.email},
                {tel1: req.newUser.tel1},
                {tel2: req.newUser.tel2}
            ]
        })
        console.log("2")
        var otherFisicos = await Fisicos.find({cpf: req.newUser.cpf})

        console.log("3")
        if (other.length > 0 || otherFisicos.length > 0){
            var err = {
                code: 401,
                msg: "dados repitidos"
            }

            throw err
        }

        console.log("4")
        var newSenha = await bcrypt.hashSync(req.newUser.senha, 10)
        console.log("5")
        var newResposta = await bcrypt.hashSyc(req.body.resposta, 10)

        console.log("6")
        req.newUser.senha = newSenha
        console.log("7")
        req.newUser.resposta = newResposta

        console.log("8")
        if(req.newUser.cpf.slice(-1).match(/[a-zA-Z]/)){
            console.log("9")
            req.newUser.cpf = req.newUser.cpf.slice(0,-1).replace(/\D/g, "") + req.newUser.cpf.slice(-1)
            console.log("10")
        }else{
            console.log("11")
            req.newUser.cpf = req.newUser.cpf.replace(/\D/g, "")
            console.log("1")
        }

        console.log("12")
        var newFisico = await new Fisicos(req.newUser).save()
        console.log("13")
        req.newUser.fisico = newFisico._id
        console.log("14")
        var newUser = await Usuarios(req.newUser).save()

        console.log("15")
        console.log("novo usuario cadastrado")

        res.status(200).send({
            msg: "usuario cadastrado com sucesso"
        })
        
    }catch(e){

        try{
            if (newFisico) await Fisicos.deleteOne({_id: newFisico._id})
            if (newUser) await Usuarios.deleteOne({_id: newUser._id})
        }catch(err){}

        console.log("erro ao cadastrar usuário:: " + e.msg || e)

        res.status(e.code || 500).send({
            msg: "erro ao cadastrar usuario"
        })

    }
    


})

router.post('/ong', uploadOng.single('social'), gcs.upload, verifOng, async (req, res)=>{

    req.newUser.estadoSocial = req.newFile
    try{
        var other = await Usuarios.find({
            $or: [
                {email: req.newUser.email},
                {tel1: req.newUser.tel1},
                {tel2: req.newUser.tel2}
            ]
        })

        if (other.length > 0){
            var err = {
                code: 401,
                msg: "dados repitidos"
            }

            throw err
        }

        var newSenha = await bcrypt.hashSync(req.newUser.senha, 10)
        var newResposta = await bcrypt.hashSyc(req.body.resposta, 10)

        req.newUser.senha = newSenha
        req.newUser.resposta = newResposta

        var newOng = await new Ongs(req.newUser).save()
        req.newUser.ong = newOng._id
        var newUser = await Usuarios(req.newUser).save()

        console.log("novo usuario cadastrado")

        res.status(200).send({
            msg: "usuario cadastrado com sucesso"
        })
        
    }catch(e){

        try{
            if (newOng) await Ongs.deleteOne({_id: newOng._id})
            if (newUser) await Usuarios.deleteOne({_id: newUser._id})
        }catch(e){}

        console.log("erro ao cadastrar usuário:: " + e.msg || e)

        res.status(e.code || 500).send({
            msg: "erro ao cadastrar usuario"
        })

    }
            

})

//exportação
module.exports = router