const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animaisSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    responsavel: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    especie: {
        type: String,
        enum: ["cao", "gato"],
        required: true
    },
    pelagem: {
        type: String,
        required: true
    },
    porte:{
        type: String,
        enum: ["p", "pm", "m", "mg", "g"],
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    observacao: {
        type: String
    },
    // * historico de saúde
    vacinas: {
        type: Array
    },
    doencas: {
        type: Array
    },
    alergias: {
        type: Array
    },
    deficiencias: {
        type: Array
    }

})

mongoose.model("animais", animaisSchema)