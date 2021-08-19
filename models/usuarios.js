const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usuarioSchema = new Schema({


    nome: {
        type: String,
        required: true
    },

    endereco: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    tel1: {
        type: Number,
        required: true
    },

    tel2: {
        type: Number,
        required: false
    },

    imagem: {
        type: String,
        required: false
    },

    tipo: {
        type: String,
        enum: ['nrm', 'adm','ong'],
        default: 'nrm'
    },

    fisico: {
        type: Schema.Types.ObjectId,
        ref: "fisicos"
    },

    ong: {
        type: Schema.Types.ObjectId,
        ref: "ongs"
    }

})

mongoose.model("usuarios", usuarioSchema)