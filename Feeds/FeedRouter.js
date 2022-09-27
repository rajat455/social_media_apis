const express = require("express")
const { AddNewPost, Remove } = require("./FeedController")
const FeedRouter = express.Router()

FeedRouter.post("/add", AddNewPost)
FeedRouter.delete("/delete", Remove)

module.exports = FeedRouter