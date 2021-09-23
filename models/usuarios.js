const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usuarioSchema = new Schema({


    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    senha: {
        type: String,
        required: true,
        selec: false
    },

    endereco: {
        type: String,
        required: true,
        selection: false
    },

    tel1: {
        type: Number,
        required: true,
        unique: true
    },

    ddd1: {
        type: Number,
        required: true
    },

    tel2: {
        type: Number,
        required: false,
        unique: true
    },

    ddd2: {
        type: Number,
        required: true
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