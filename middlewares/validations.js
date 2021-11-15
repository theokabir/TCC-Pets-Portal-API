const mongoose = require('mongoose')
const validator = require('validator')
const { cpf } = require('cpf-cnpj-validator')

require('./../models/usuarios')
const Usuarios = mongoose.model('usuarios')

exports.email = (email) => {
  try{
    var quant = Usuarios.find({email: email}).count
    if (quant > 0) return false
    else return validator.isEmail(email)
  }catch(e){
    return false
  }
}

exports.senha = (senha) => {
  if (senha.length < 8) return false
  else if (senha.toUpperCase() === senha) return false
  else if (senha.toLowerCase() === senha) return false
  else if (!senha.match(/\d/g)) return false
  else return true
}

exports.cpf = (cpfToValid, res) => {
  try{
    var quant = Usuarios.find({tipo: "nrm"}).populate({
      path: 'fisico',
      match: {
        cpf: cpfToValid
      }
    }).count()

    if (quant > 0) return false
    else return cpf.isValid(cpfToValid)
  }catch(e){
    res.status(500).send({
      msg: "erro ao validar cpf"
    })
  }
}