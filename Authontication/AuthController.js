const jwt = require("jsonwebtoken")

const JWT_SECRATE = process.env.JWT_SECRATE
module.exports =  new class AuthConroller {
    constructor(){
    }
    generateToken(data){
        return jwt.sign(data,JWT_SECRATE, {expiresIn:"30d"})
    }
}()

