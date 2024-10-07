const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Store connected users
const users = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for the username event from the client
    socket.on('set username', (username) => {
        const usernameExists = Object.values(users).some(user => user.username === username);

        if (usernameExists) {
            socket.emit('username taken', 'This username is already taken, please choose another one.');
        } else {
            users[socket.id] = { username };
            socket.emit('username accepted', username);
        }
    });

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        const user = users[socket.id];
        if (user) {
            io.emit('chat message', msg);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 2827;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
