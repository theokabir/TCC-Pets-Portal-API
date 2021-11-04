const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pedidosSchema = new Schema({

    adotante: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    doador: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    animal: {
        type: Schema.Types.ObjectId,
        ref: "animais",
        required: true
    },
    observacao: {
        type: String
    },
    data: {
        type: Date,
        default: Date.now()
    },

    status: {
        type: String,
        enum: ["espera", "confirmado", "recusado"],
        default: "espera"
    }

})

mongoose.model('pedidos', pedidosSchema)