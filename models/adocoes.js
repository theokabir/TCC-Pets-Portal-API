const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adocaoSchema = new Schema({

    adotante: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required: true
    },

    doador: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
        required: true
    },

    animal: {
        type: Schema.Types.ObjectId,
        ref: "animais",
        required: true
    },

    data:{
        type: Date,
        default: Date.now()
    }

})

mongoose.model("adocoes", adocaoSchema)