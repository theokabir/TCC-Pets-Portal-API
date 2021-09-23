const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('./../config/config.json')

require("./../models/usuarios")
const Usuarios = mongoose.model('usuarios')

exports.obrigatorio = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, config.tokenKey)
        req.data = decode
        next ()
    }catch(err){

        console.log(`erro ao verififcar token:::::${err}`)

        res.status(401).send({
            msg: "erro ao verificar token"
        })
    }
}

exports.admin = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, config.tokenKey)
        req.data = decode
        Usuarios.findOne({_id: req.data._id})
        .then(user=>{
            if(user.tipo === "adm"){
                next()
            }else{
                console.log(`Usuario não é administrador`)

                res.status(401).send({
                    msg: "usuario não é administrador"
                })
            }
        })
        .catch(e=>{
            console.log(`erro ao verififcar perfil de administrador:::::${e}`)

            res.status(401).send({
            msg: "erro ao verificar token"
            })
        })

        next ()
    }catch(err){

        console.log(`erro ao verififcar token:::::${err}`)

        res.status(401).send({
            msg: "erro ao verificar token"
        })
    }
}

exports.ong = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, config.tokenKey)
        req.data = decode
        Usuarios.findOne({_id: req.data._id})
        .then(user=>{
            if(user.tipo === "adm" || user.tipo === "ong"){
                next()
            }else{
                console.log(`Usuario não é administrador`)

                res.status(401).send({
                    msg: "usuario não é administrador"
                })
            }
        })
        .catch(e=>{
            console.log(`erro ao verififcar perfil de administrador:::::${e}`)

            res.status(401).send({
            msg: "erro ao verificar token"
        })
        })

        next ()
    }catch(err){

        console.log(`erro ao verififcar token:::::${err}`)

        res.status(401).send({
            msg: "erro ao verificar token"
        })
    }
}

exports.opcional = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, config.tokenKey)
        req.data = decode
        next()
    }catch(err){
        next()
    }
}