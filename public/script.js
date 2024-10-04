const socket = io();

// Display incoming messages
socket.on('chat message', function (msg) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto scroll to bottom
});

// Send message when clicking the send button
document.getElementById('send-btn').onclick = function () {
    sendMessage();
};

// Send message when pressing the Enter key
document.getElementById('message-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to send the message
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chat message', `Anonymous: ${message}`);
        messageInput.value = ''; // Clear input after sending
    }
}
