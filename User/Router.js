const express = require("express")
const { CreateNew, VerifyOtp, Login } = require("./UserController")
const { FileUpload } = require("./UserController")

const UserRouter = express.Router()

UserRouter.post("/create", CreateNew)
UserRouter.post("/verify-otp", VerifyOtp)
UserRouter.post("/login", Login)
UserRouter.post("/file-upload", FileUpload)


module.exports = UserRouter