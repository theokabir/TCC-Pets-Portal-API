const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ongSchema = Schema({

    desc: {
        type: String,
        required: true
    },

    estadoSocial: {
        type: String,
        required: true
    }

})

mongoose.model("ongs", ongSchema)