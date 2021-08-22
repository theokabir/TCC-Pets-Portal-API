// * hash utilizando bcrypt
const hashSenha = senha => {
    bcrypt.hash(senha, 10, (errBcrypt, hash)=>{
        if(errBcrypt){
            return false
        }
        else{
            return hash
        }
    })
}

// * verificação de pessoas físicas
const verificacaoPessoaFisica = data => {
    if (
        data.nome &&
        data.email &&
        data.senha &&
        data.endereco &&
        data.tel1 &&
        data.nasc &&
        data.cpf
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