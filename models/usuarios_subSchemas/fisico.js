const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fisicoSchema = new Schema({
    nasc: {
        type: Date,
        required: true
    },

    cpf: {
        type: String,
        required: true,
        unique: true
    },

    desc: {
        type: String
    }
})

mongoose.model("fisicos", fisicoSchema)