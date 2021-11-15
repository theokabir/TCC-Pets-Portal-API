const verifPessoaFisica = (req, res, next) => {
  var dataUsuario = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    senha2: req.body.senha2,
    endereco: req.body.endereco,
    tel1: req.body.tel1.slice(2),
    ddd1: req.body.tel1.slice(0, 2),
    tel2: req.body.tel2.slice(2),
    ddd2: req.body.tel2.slice(0, 2),
    nasc: req.body.nasc,
    cpf: req.body.cpf,
    desc: req.body.desc
  }

  if (
    // * verificação dos dados da ong
    dataUsuario.nome &&
    dataUsuario.email &&
    dataUsuario.senha &&
    dataUsuario.senha2 &&
    dataUsuario.endereco &&
    dataUsuario.tel1 
  ){

    

    if (dataUsuario.senha !== dataUsuario.senha2)
      res.status(401).send({
        msg: "senhas não compatíveis"
      })

    else {

      if (!validation.email(dataUsuario.email))
      res.status(401).send({
        msg: "email invalido ou já utilizado"
      })
      if(!validation.senha(dataUsuario.senha))
        res.status(401).send({
          msg: "senha deve conter: letras minúsculas, letras maiúsculas e pelo menos 8 caracteres"
      })
      else{
        req.newUser = dataUsuario
        next()
      }
    }

  }
  else{
    res.status(401).send({
      msg: "falta de dados necessários"
    })
  }


}

module.exports = verifPessoaFisica