const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventsSchema = new Schema({

  nome: {
    type: String,
    required: true
  },

  responsavel: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  },

  contato: {
    type: String,
    required: true
  },

  local:{
    type: String,
    required: true
  },

  data: {
    type: Date,
    required: true
  },

  observacao: {
    type: String
  },

  especies: {
    type: String,
    enum: ["c", "g","cg", "geral"],
    required: true
  },
  
  banner: {
    type: String,
    required: true
  },

  editado: {
    type: Boolean,
    default: false
  }

})

mongoose.model("eventos", eventsSchema)