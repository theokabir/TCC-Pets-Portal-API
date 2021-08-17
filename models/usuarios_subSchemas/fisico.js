const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fisicoSchema = new Schema({
    nascimento: {
        type: Date,
        required: true
    },

    cpf: {
        type: Number,
        required: true
    },

    desc: {
        type: String
    }
})

mongoose.model("fisicos", fisicoSchema)