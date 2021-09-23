const fs = require('fs')

const verifOng = (req, res, next) => {
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
    desc: req.body.desc
  }

  if (
    // * verificação dos dados da ong
    dataUsuario.nome &&
    dataUsuario.email &&
    dataUsuario.senha &&
    dataUsuario.senha2 &&
    dataUsuario.endereco &&
    dataUsuario.tel1 &&
    dataUsuario.desc &&
    req.file
    )
  {


    if (dataUsuario.senha !== dataUsuario.senha2)
      res.status(401).send({
        msg: "senhas não compativeis"
      })
     else {
       req.newUser = dataUsuario
       next()
     }

  }
  else {

    console.log("file: " + req.file)

    if ( req.file ){

      try {
        fs.unlink(req.file.path, err => {
          if (err)
            res.status(500).send({
              msg: "erro ao exluir arquivo, arquivo não existente",
              err: err
            })
          else{
            res.status(401).send({
              msg: "erro ao criar usuário, falta de dados e foto excluida com sucesso"
            })
          }
        })
      }
      catch (err) {
        res.status(500).status({
          msg: 'erro ao remoover arquivo de foto, não existente'
        })
      }

    } else{
      res.status(401).send({
        msg: "falta de informação obrigaória",
        data: dataUsuario
      })
    }

  }
}

module.exports = verifOng