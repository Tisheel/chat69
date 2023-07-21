require('dotenv').config()
const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const path = require("path")

const app = express()

const PORT = process.env.PORT || 3000

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

const users = {}

app.use(express.static(path.join(__dirname, "app", "build")))
app.use((req, res, next) => {
    res.status(404).send(
        "<span>Page not found go to </span><a href='/'>home</a>")
})

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "app", "build", "index.html"))
})

io.on("connection", (socket) => {
    socket.on('join-room', (req) => {
        socket.join(req.roomId)
        users[socket.id] = req.name

        const members = []
        const sockets = io.sockets.adapter.rooms.get(req.roomId)
        for (let value of sockets) {
            members.push(users[value])
        }
        io.sockets.to(req.roomId).emit('room-members', members)
    })

    socket.on('send-message', (req) => {
        const time = new Date().getHours().toString() + ':' + new Date().getMinutes().toString()
        io.sockets.to(req.roomId).emit('receive-message', { message: req.message, time, author: users[socket.id], id: socket.id })
    })

    socket.on('disconnecting', () => {
        const [, roomId] = socket.rooms
        if (roomId !== undefined) {
            const members = []
            const sockets = io.sockets.adapter.rooms.get(roomId)
            for (let value of sockets) {
                if (value !== socket.id) {
                    members.push(users[value])
                }
            }
            io.sockets.to(roomId).emit('room-members', members)
        }
    })

    socket.on('disconnect', () => {
        const id = socket.id
        delete users[id]
    })
})

httpServer.listen(PORT, () => console.log('Server on port ' + PORT))