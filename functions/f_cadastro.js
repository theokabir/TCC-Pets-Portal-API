const mongoose = require('mongoose')
require('./../models/usuarios')
const Usuarios = mongoose.model('usuarios')

// * verificação de pessoas físicas
exports.verificacaoPessoaFisica = data => {

    if (
        // * verificações de dados
        // TODO: revisar verificações com o pessoal
        data.nome &&
        data.email &&
        data.senha &&
        data.endereco &&
        data.tel1 &&
        data.nasc &&
        data.cpf &&
        data.senha === data.senha2
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

exports.verificacaoOng = data => {
    if (
        // * verificação dos dados da ong
        data.nome &&
        data.email &&
        data.senha &&
        data.endereco &&
        data.tel1 &&
        data.estadoSocial &&
        data.desc &&
        data.senha === data.senha2
    ){
        
        Usuarios.findOne({email: data.email})
        .then(user => {
            if (user) return "Usuário ja registrado"
            else return true
        })
        .catch(e => {
            return false
        })

    }
    else {
        // TODO: revisar
        return "Falta de dados nescessários"
    }
}