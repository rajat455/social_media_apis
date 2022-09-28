const express = require("express")
const { AddNewPost, Remove, GetAllFeeds } = require("./FeedController")
const FeedRouter = express.Router()

FeedRouter.post("/add", AddNewPost)
FeedRouter.delete("/delete", Remove)
FeedRouter.get("/", GetAllFeeds)

module.exports = FeedRouter