var express = require('express')
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server).sockets
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Chat = require('./chatModel')
var User = require('./user')
var routes = require('./routes')
var cors = require('cors')
users = {};
connections = [];
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', routes)

mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log("MongoDB connected")
})
server.listen(process.env.PORT || 3000, () => {
    console.log("Server connected")
});
io.on('connection', (socket) => {
    connections.push(socket)
    console.log(`${connections.length}` + " Sockets Connected ")

    Chat.find({}, (err, docs) => {
        if (err) {
            throw err;
        }
        io.emit('old messages', docs)
    })
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1)
        console.log(`${connections.length}` + " Sockets Connected")
        if (!socket.user) return;
        if (users[socket.user]) {
            delete users[socket.user];
        }
        io.emit('allUsers', Object.keys(users));
    })
    socket.on('send message', (data) => {
        let newMsg = new Chat({
            user: socket.user,
            message: data
        })
        newMsg.save((err) => {
            if (err) {
                throw err;
            }
            io.emit('new message', { message: data, user: socket.user })
        })
    })

    socket.on('userName', (data) => {
        let flag = false;
        if (data in users) {
            flag = true;
            io.emit('allUsers', flag)
        }
        if (!flag) {
            socket.user = data;
            users[socket.user] = socket
            io.emit('allUsers', Object.keys(users))
        }
    })
})


// var express = require('express')
// var app = express();
// var server = require('http').createServer(app)
// var io = require('socket.io').listen(server).sockets
// var mongoose = require('mongoose')
// var bodyParser = require('body-parser')
// var Message = require('./chatModel')
// var User = require('./user')
// var routes = require('./routes')
// var cors = require('cors')
// users = [];
// connections = [];
// app.use(cors())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use('/api', routes)

// mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });
// mongoose.connection.on('connected', () => {
//     console.log("MongoDB connected")
// })
// server.listen(process.env.PORT || 3000, () => {
//     console.log("Server connected")
// });
// io.on('connection', (socket) => {
//     connections.push(socket)
//     console.log(`${connections.length}` + " Sockets Connected ")

//     socket.on('disconnect', () => {
//         if (!socket.user) return;
//         users.splice(users.indexOf(socket.user), 1)
//         io.emit('allUsers', users)
//         connections.splice(connections.indexOf(socket), 1)
//     })
//     socket.on('send message', (data) => {
//         io.emit('new message', { msg: data, user: socket.user })
//     })

//     socket.on('userName', (data) => {
//         let flag = false;
//         for (let i = 0; i < users.length; i++) {
//             if (users[i] == data) {
//                 flag = true;
//                 io.emit('allUsers', flag)
//             }
//         }
//         if (!flag) {
//             socket.user = data;
//             users.push(socket.user);
//             io.emit('allUsers', users)
//         }
//     })
// })