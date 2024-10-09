const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Store connected users
const users = {};
const userRooms = {};  // New object to store the room each user is in

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
            socket.join('global');  // Join default global room
            userRooms[socket.id] = 'global';  // Store the user's current room
        }
    });

    // Handle room joining
    socket.on('join room', (room) => {
        socket.leave(userRooms[socket.id]);  // Leave the previous room
        socket.join(room);  // Join the new room
        userRooms[socket.id] = room;  // Update the user's current room
        console.log(`${users[socket.id].username} joined room: ${room}`);
    });

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        const user = users[socket.id];
        const room = userRooms[socket.id];  // Get the user's current room
        if (user) {
            // Send message only to users in the same room
            io.to(room).emit('chat message', msg);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete users[socket.id];
        delete userRooms[socket.id];  // Remove the user's room info on disconnect
    });
});

const PORT = process.env.PORT || 2827;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
