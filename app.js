const { json } = require("express")
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const UserRouter = require("./User/Router")
const fileupload = require("express-fileupload")
const ConRouter = require("./Connection/ConRouter")
const moment = require("moment/moment")
const FeedRouter = require("./Feeds/FeedRouter")
require("dotenv").config()



const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
app.use(json())



app.use(fileupload())
app.use("/uploads",express.static("./uploads") )

app.use("/api/user", UserRouter)
app.use("/api/con", ConRouter)
app.use("/api/feed", FeedRouter)

app.get("/", (req, res) => {
    return res.status(200).send({ message: "Success" })
})


server.listen(PORT, () => {
    console.log("Server Started")
})