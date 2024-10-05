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
    // Assign a unique ID (using socket.id) to the connected user
    const userId = socket.id;
    users[userId] = { id: userId }; // Store user ID

    console.log(`User connected: ${userId}`);

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        // Add the sender ID to the message object
        msg.senderId = userId;
        io.emit('chat message', msg); // Emit the message to all clients
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        delete users[userId]; // Remove user from the users list
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
