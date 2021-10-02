const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fisicoSchema = new Schema({
    nasc: {
        type: Date,
        required: true
    },

    cpf: {
        type: Number,
        required: true,
        unique: true
    },

    desc: {
        type: String
    }
})

mongoose.model("fisicos", fisicoSchema)