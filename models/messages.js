const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({

    remetente: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    animal: {
        type: Schema.Types.ObjectId,
        ref: "animais"
    },
    assunto:{
        type: String,
    },
    msg: {
        Type: String,
    },
    resposta:{
        Type: String,
    }

})

mongoose.model("mensagens", messageSchema)