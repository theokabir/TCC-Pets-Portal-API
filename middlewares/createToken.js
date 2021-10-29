const jwt = require('jsonwebtoken')

const generate = data => {
    const token = jwt.sign(data,process.env.TOKEN_KEY,{ expiresIn: process.env.TOKEN_TIME })
    return token
}

module.exports = generate