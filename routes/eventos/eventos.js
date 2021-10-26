const express = require('express')
const router = express.Router()
const cadastroRouter = require('./cadastro')
const deleteRouter = require('./deletar')
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/eventos')
const Eventos = mongoose.model('eventos')

router.use('/cadastro', cadastroRouter)
router.use('/deletar', deleteRouter)

router.post('/perfil', authToken.obrigatorio, async (req, res) => {
  try{

    var eventos = await Eventos.find({responsavel: req.data.id})

    console.log(`todos os eventos do usuario ${req.data.id} acessados`)

    res.status(200).send({
      msg: "eventos listados",
      eventos
    })

  }catch(e){
    //TODO: catch
    console.log("erro ao listar eventos::: " + e)

    res.status(500).send({
      msg: "erro ao listar eventos"
    })
  }
})

module.exports = router