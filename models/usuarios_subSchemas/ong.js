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
    },
    verificado: {
        type: Boolean,
        default: false
    }

})

mongoose.model("ongs", ongSchema)