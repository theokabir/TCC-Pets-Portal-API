const multer = require('multer')
const bcrypt = require('bcrypt')

const megabyteLimit = 5

const fileFilter = (req, file, cb)=>{

    if(file.mimetype==='image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    } 

}

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./uploads/")
    },
    filename: (req, file, cb)=>{

        const extensao = file.originalname.split('.').pop()
        bcrypt.hash(file.originalname, 10, (errBcrypt, hash)=>{
            if (errBcrypt){
                cb(null, false)
            }else{
                cb(null, `${hash.replace(/\W/g,"")}.${extensao}`)
            }
        })

    }
})


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * megabyteLimit
    },
    fileFilter: fileFilter
})

module.exports = upload