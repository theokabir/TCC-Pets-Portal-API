//=========arquivo principal==============
//importações
//aqui são importadas as principais dependências do projeto 
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./config/config.json')

//variaveis
//aqui são declaradas variáveis importantes para o funcionamento do algoritmo
const app = express()
const port = process.env.PORT || 3000

//rotas
//aqui, os arquivos de rotas são colocados em variáveis para serem definidos com suas rotas a partir do root
const userRouter = require('./routes/usuario/_usuario')

//configurações
//configurações importantes para o servidor
app.use(cors())
// TODO: excluir o morgan antes do deploy
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(__dirname + "/uploads"))
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Acess.Control-Allow-Header",
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
//externas
app.use("/user", userRouter)

//raiz
app.get("/", (req, res)=>{
    res.status(200).send({
        msg: "rota raiz"
    })
})

//abrindo servidor
app.listen(port, ()=>console.log(`servidor aberto na porta ${port}`))