const jwt = require("jsonwebtoken")

const JWT_SECRATE = "somthing"
module.exports =  new class AuthConroller {
    constructor(){
    }
    generateToken(data){
        return jwt.sign(data,JWT_SECRATE, {expiresIn:"30d"})
    }
}()

