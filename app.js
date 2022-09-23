const { json } = require("express")
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const UserRouter = require("./User/Router")


const app = express()
const server = http.createServer(app)
const io = socketIo(server)
app.use(json())



app.use("/api/user", UserRouter)

app.get("/", (req, res) => {
    return res.status(200).send({ message: "Success" })
})


server.listen(5000, () => {
    console.log("Server Started")
})
