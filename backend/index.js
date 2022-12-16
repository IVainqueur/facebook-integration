const express = require('express')
const { Server: SocketServer } = require('socket.io')
const cors = require('cors')

const app = express()

require('dotenv').config()
app.use(cors())
app.use(express.json({}))
app.post('/webhook', (req, res) => {
    console.log('[webhook]', req.body);
    io.sockets.emit('serverEvent', { requestBody: req.body })
    res.status(200).send("EVENT_RECEIVED");
})
app.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    console.log("[verification]", {
        mode, token, challenge
    })
    if (token === process.env.VerificationToken) {
        res.status(200).send(challenge)
    } else {
        res.status(403).send('You are wrong')
    }
})

app.get('*', (req, res) => {
    console.log("[unknown route]", req.path, req.query)
    res.status(404).json({ code: '#unknown', message: "This particular route could not be found." })
})

const server = app.listen(process.env.PORT, () => {
    console.log("[server] up and running...")
})

const io = new SocketServer(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
    console.log('[io] new user')
})

// io.listen(process.env.PORT + 1)