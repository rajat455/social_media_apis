const express = require("express")
const { Request, RejectRequest, CreateNewGroup, makeAdmin } = require("./ConController")
const ConRouter = express.Router()


ConRouter.post("/create", Request)
ConRouter.put("/reject", RejectRequest)
ConRouter.post("/create-group", CreateNewGroup)
ConRouter.put("/group/make-admin", makeAdmin)

module.exports = ConRouter