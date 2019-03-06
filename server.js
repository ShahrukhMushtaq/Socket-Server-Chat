var express = require('express')
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
users = [];
connections = [];

server.listen(process.env.PORT || 3000, () => {
    console.log("Server connected")
});

io.sockets.on('connection', (socket) => {
    connections.push(socket)
    console.log(`${connections.length}` + " Sockets Connected ")

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1)
        console.log("Disconnected: %s sockets connected", connections.length)
    })
    socket.on('send message', (data) => {
        io.sockets.emit('new message', { data })
    })
})