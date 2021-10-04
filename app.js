//=========arquivo principal==============
//importações
//aqui são importadas as principais dependências do projeto
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

//models
//"tabelas" do mongo db
require('./models/usuarios')
//require('./models/usuarios_subSchemas/fisico')
//require('./models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
//const Fisicos = mongoose.model('fisicos')
//const Ongs = mongoose.model('ongs')

//variaveis
//aqui são declaradas variáveis importantes para o funcionamento do algoritmo
const app = express()
const port = process.env.PORT || 3000
const config = require('./config/config.json')

//middlewares
//arquivos com funções que interceptam a requisição para fazer verificações
const authToken = require('./middlewares/authToken')

//rotas
//aqui, os arquivos de rotas são colocados em variáveis para serem definidos com suas rotas a partir do root
const userRouter = require('./routes/usuario/_usuario')
const adminRouter = require('./routes/admin/_adimin')

//configurações
//configurações importantes para o servidor
app.use(cors())
// TODO: excluir o morgan antes do deploy
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(__dirname + "/uploads"))
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Acess-Control-Allow-Header",
    "Accept, Authorization, X-Requested-With, Origin, Content-Type")

    if(req.method==="OPTIONS")
        res.header("Acess-Control-Allow-Methods", "GET, POST, DELETE, PATCH")

    next()
})

//banco de dados
mongoose.connect(config.mongoRoute, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("aplicativo conectado ao banco de dados")
})
.catch(e=>{
    console.log(`erro ao conectar aplicativo ao banco de dados::${e}`)
})

//rotas

//rotas da raiz
app.get("/", (req, res)=>{
  res.status(200).send({
    msg: "rota raiz"
  })
})

app.post('/navValidation', authToken.opcional, async (req, res) => {
  
  var user = {}
  
  if (req.data) {
    await Usuarios.findOne({_id: req.data.id})
    .then(userRes => {
      user.tipo = (userRes.tipo === "adm")?"adm":"nrm"
      user.id = req.data.id
      user.nome = userRes.nome
      user.img = userRes.imagem
    })
    .catch(e => {
      console.log(`erro ao encontrar usuário na validação do token\nerro:::${e}`)
      res.status(500).send({
        msg: "erro ao encontrar usuário"
      })
    })
  }
  
  //externas
  app.use("/user", userRouter)
  app.use("/admin", adminRouter)

  res.status(200).send({
    msg: "sucesso ao validar token",
    user
  })

})

//abrindo servidor
app.listen(port, ()=>console.log(`servidor aberto na porta ${port}`))