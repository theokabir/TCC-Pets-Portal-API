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


const upload = multer({
    storage: multer.memoryStorage,
    limits: {
        fileSize: 1024 * 1024 * megabyteLimit
    },
    fileFilter: fileFilter
})

module.exports = upload