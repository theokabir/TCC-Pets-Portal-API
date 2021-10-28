const express = require('express')
const router = express.Router()
const cadastroRouter = require('./cadastro')
const deleteRouter = require('./deletar')
const editRouter = require('./editar')
const mongoose = require('mongoose')
const authToken = require('./../../middlewares/authToken')

require('./../../models/eventos')
require('./../../models/usuarios')
const Eventos = mongoose.model('eventos')
const Usuarios = mongoose.model('usuarios')

router.use('/cadastro', cadastroRouter)
router.use('/deletar', deleteRouter)
router.use('/edit', editRouter)

router.post('/:id', authToken.obrigatorio, async (req, res) => {

  var me = false

  try{
    var evento = await Eventos.dinfOne({_id: req.params.id})
    me = evento.responsavel == req.data.id

    res.status(200).send({
      msg: "evento listado com sucesso",
      me,
      evento
    })

  }catch(e){
    console.log("erro ao listar eventos::: " + e)

    res.status(500).send({
      msg: "erro ao listar eventos"
    })
  }
})

module.exports = router