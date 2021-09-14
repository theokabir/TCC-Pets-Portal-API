const jwt = require('jsonwebtoken')
const config = require('../config/config.json')

const generate = data => {
    const token = jwt.sign(data,config.tokenKey,{ expiresIn: config.tokenTime })
    return token
}

module.exports = generate