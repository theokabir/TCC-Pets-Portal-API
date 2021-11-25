const { Storage } = require('@google-cloud/storage')
const bcrypt = require("bcrypt")

const dotenv = require('dotenv')
dotenv.config()

const storage = new Storage({
  projectId: process.env.GCS_PROJECT,
  credentials:{
    client_email: process.env.GCS_CLIENT_EMAIL, 
    private_key: process.env.GCS_CLIENT_KEY
  }
})

const bucket = storage.bucket(process.env.GCS_BUCKET)

exports.upload = async (req, res, next) => {

  if (req.file){
    var file = req.file
    console.log(file)
    var publicUrl = ""
    
    const extensao = file.originalname.split('.').pop()
    await bcrypt.hash(file.originalname, 10, (errBcrypt, hash)=>{
        if (errBcrypt){
            res.status(500).send({msg: "nome da imagem não foi criptografado"})
        }else{
  
            var blob = bucket.file(hash.replace(/\W/g,"") + "." +extensao)
            const blobStream = blob.createWriteStream();
  
            blobStream.on("error", (err) => {
              res.status(500).send({ message: err.message });
            });
  
            blobStream.on("finish", async (data) => {
              publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  
              console.log(publicUrl)
  
              req.newFile = publicUrl
              next()
  
            })
            
            blobStream.end(req.file.buffer);
            console.log("finished")
        }
    })
  }else{
    res.status(500).send({msg: "foto  inexistente"})
  }
}

exports.delete = async (foto) => {

  try{
    await bucket.file(foto).delete()
    console.log(`${foto} deletada`)
  }catch(e){
    console.log("ppippipipopopop")
    console.log("foto não existe")
  }

}