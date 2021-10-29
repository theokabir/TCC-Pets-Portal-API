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

  var file = req.file
  console.log(file)
  
  const extensao = file.originalname.split('.').pop()
  bcrypt.hash(file.originalname, 10, (errBcrypt, hash)=>{
      if (errBcrypt){
          res.status(500).send({msg: "nome da imagem não foi criptografado"})
      }else{

          var blob = bucket.file(hash.replace(/\W/g,"") + "." +extensao)
          const blobStream = blob.createWriteStream();

          blobStream.on("error", (err) => {
            res.status(500).send({ message: err.message });
          });

          blobStream.on("finish", async (data) => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

            console.log(publicUrl)

            req.data.file = publicUrl
          })

          blobStream.end(req.file.buffer);

          next()
      }
  })
}

exports.delete = async (foto) => {
  
  if(bucket.file(foto).exists()){
    await bucket.file(foto).delete()
    console.log(`${foto} deletada`)
  }else{
    console.log("foto não existe")
  }

}