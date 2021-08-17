//arquivo principal 
//importações
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

//variaveis
const app = express()
const port = process.env.PORT || 3000

//configurações
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use((req, res, next)=>{
    app.header("Access-Control-Allow-Origin", "*")
    app.header("Acess.Control-Allow-Header",
    "Accept, Authorization, X-Requested-With, Origin, Content-Type")

    if(req.method==="OPTIONS")
        app.header("Acess-Control-Allow-Methods", "GET, POST, DELETE, PATCH")

    next()
})

//banco de dados
mongoose.connect('mongodb://localhost/petsportal', {
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
//raiz
app.get("/", (req, res)=>{
    res.status(200).send({
        msg: "rota raiz"
    })
})

//abrindo servidor
app.listen(port, ()=>console.log(`servidor aberto na porta ${port}`))