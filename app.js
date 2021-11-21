//=========arquivo principal==============
//importações
//aqui são importadas as principais dependências do projeto
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const validation = require('./middlewares/validations')

//models
//"tabelas" do mongo db
require('./models/usuarios')
//require('./models/usuarios_subSchemas/fisico')
require('./models/usuarios_subSchemas/ong')
const Usuarios = mongoose.model('usuarios')
//const Fisicos = mongoose.model('fisicos')
const Ongs = mongoose.model('ongs')

//variaveis
//aqui são declaradas variáveis importantes para o funcionamento do algoritmo
const app = express()

//middlewares
//arquivos com funções que interceptam a requisição para fazer verificações
const authToken = require('./middlewares/authToken')

//rotas
//aqui, os arquivos de rotas são colocados em variáveis para serem definidos com suas rotas a partir do root
const userRouter = require('./routes/usuario/usuario')
const adminRouter = require('./routes/admin/adimin')
const animaisRouter = require('./routes/animais/animais')
const eventsRouter = require('./routes/eventos/eventos')
const homeRouter = require('./routes/home/home')
const searchRouter = require('./routes/search/search')
const reportsRouter = require('./routes/reports/reports')
const recoverRouter = require('./routes/recover/recover')

//configurações
//configurações importantes para o servidor
app.use(morgan('dev'))
app.use(cors())
// TODO: excluir o morgan antes do deploy
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(__dirname + "/uploads"))
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Header",
    "Accept, Authorization, X-Requested-With, Origin, Content-Type")

    if(req.method==="OPTIONS")
        res.header("Acess-Control-Allow-Methods", "GET, POST, DELETE, PATCH")

    next()
})

//banco de dados
mongoose.connect(process.env.MONGO_URI, {
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
//externas
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/animals", animaisRouter)
app.use("/events", eventsRouter)
app.use("/home", homeRouter)
app.use("/search", searchRouter)
app.use("/reports", reportsRouter)
app.use("/recover", recoverRouter)

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
      user.tipo = userRes.tipo
      user.id = req.data.id
      user.nome = userRes.nome
      user.img = userRes.imagem

      if (userRes.tipo == "ong"){
        var ong = await Ongs.findOne({_id: userRes.ong})
        user.verificado = ong.verificado
      }else{
        user.verificado = false
      }

    })
    .catch(e => {
      console.log(`erro ao encontrar usuário na validação do token\nerro:::${e}`)
      res.status(500).send({
        msg: "erro ao encontrar usuário"
      })
    })
  }

  res.status(200).send({
    msg: "sucesso ao validar token",
    user
  })

})

app.post('/getId', authToken.opcional, (req, res) => {

  if(!req.data.id){
    res.status(200).send({
      msg: "usuário não possui id"
    })
  }else{
    res.status(200).send({
      msg: "id requisitado com sucesso",
      id: req.data.id
    })
  }
})

app.post('/validEmail', (req, res) => {
  if (validation.email(req.body.email)){
    res.status(200).send({
      msg: "email válido"
    })
  }else{
    res.status(401).send({
      msg: "email inválido ou já utilizado"
    })
  }
})

app.post('/validSenha', (req, res) => {
  if (validation.senha(req.body.email)){
    res.status(200).send({
      msg: "senha válida"
    })
  }else{
    res.status(401).send({
      msg: "senha deve conter: letras minúsculas, letras maiúsculas e pelo menos 8 caracteres"
    })
  }
})

app.post('/validCpf', (req, res) => {
  if (validation.cpf(req.body.email)){
    res.status(200).send({
      msg: "cpf válido"
    })
  }else{
    res.status(401).send({
      msg: "cpf inválido ou já utilizado"
    })
  }
})

//abrindo servidor
app.listen(process.env.PORT, ()=>console.log(`servidor aberto na porta ${process.env.PORT}`))