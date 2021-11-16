const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportsSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios',
    required:true
  },
  fonte: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios',
    required:true
  },
  animal: {
    type: Schema.Types.ObjectId,
    ref: "animais"
  },
  texto: {
    type: String,
    required:true
  },
  contagem: {
    type: Number,
    default: 1
  }
})

mongoose.model('reports', reportsSchema)