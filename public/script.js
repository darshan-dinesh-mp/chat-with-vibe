const socket = io();

// Display incoming messages
socket.on('chat message', function (msg) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto scroll to bottom
});

// Send message
document.getElementById('send-btn').onclick = function () {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chat message', `Anonymous: ${message}`);
        messageInput.value = ''; // Clear input after sending
    }
};