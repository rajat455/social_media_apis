const { addNew, NewOtp, GetUser, isEmailExist } = require("./UserModel")
var randomstring = require("randomstring");
const bcrypt = require('bcrypt');
const { newEmail } = require("../Email/SendEmail");
const { generateToken } = require("../Authontication/AuthController");


class UserController {
    constructor() { }

    async CreateNew(req, res) {
        try {
            const UserInfo = req.body
            if (!UserInfo.email) {
                return res.status(400).send({ message: "Missing depandency email" })
            }
            if (!UserInfo.first_name) {
                return res.status(400).send({ message: "Missing depandency first_name" })
            }
            if (!UserInfo.last_name) {
                return res.status(400).send({ message: "Missing depandency last_name" })
            }
            let username =  randomstring.generate({
                length: 2,
                charset: "numeric"
            })
            username = UserInfo.first_name.toLowerCase() + "_" + UserInfo.last_name.toLowerCase() + "@" + username
            UserInfo.username = username
            const createUser = await addNew(UserInfo)
            if (createUser) {
                const otp = randomstring.generate({
                    length: 6,
                    charset: "numeric"
                })
                const encrypotp = bcrypt.hashSync(otp, 8)
                const storeOtp = await NewOtp(encrypotp, createUser.id, createUser.email)
                if (storeOtp) {
                    await newEmail("Account Varification", `Dear user your One Time Password is ${otp}`, UserInfo.email)
                    return res.status(200).send({ message: "Success" })
                }
                return res.status(500).send({ message: "Something Went Wrong With Otp Varification" })
            }
            return res.status(500).send({ message: "Something Went Wrong With User Creation" })
        } catch (err) {
            if(err.code === "P2002"){
                return res.status(500).send({message:"Email allrady exist", err:"Duplicate key_email", code:"P2002"})
            }
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async VerifyOtp(req, res) {
        try {
            const { otp, email } = req.body
            if (!otp) {
                return res.status(400).send({ message: 'Missing depandency otp' })
            }
            if (!email) {
                return res.status(400).send({ message: 'Missing depandency email' })
            }
            const GetData = await GetUser(email)
            if (GetData) {
                if (bcrypt.compareSync(otp, GetData.otp)) {
                    const data = { ...GetData.user }
                    delete data.password
                    const token = generateToken(data)
                    return res.status(200).send({ message: "Success", token: token })
                }
                return res.status(401).send({ message: "unAuthorized", err: "Invalide OTP." })
            }
            return res.status(500).send({ message: "OTP expired" })
        } catch (err) {
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async Login(req,res) {
        try {
            const { email } = req.body
            if (!email) {
                return res.status(400).send({ message: 'Missing depandency otp' })
            }
            const isemailExist = await isEmailExist(email)
            if (isemailExist) {
                const otp = randomstring.generate({
                    length: 6,
                    charset: "numeric"
                })
                const encrypotp = bcrypt.hashSync(otp, 8)
                const storeOtp = await NewOtp(encrypotp, isemailExist.id, isemailExist.email)
                if (storeOtp) {
                    await newEmail("Account Varification", `Dear user your One Time Password is ${otp}`, isemailExist.email)
                    return res.status(200).send({ message: "Success" })
                }
                return res.status(500).send({ message: "Something Went Wrong With Otp Varification" })
            }
            return res.status(404).send({message:"Email not exist", err:"Not Found"})

        } catch (err) {
            console.log(err)
            return res.status(500).send({message:"Internal server error",err:err.message})
        }
    }

}

module.exports = new UserController()