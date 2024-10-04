const socket = io();

// Display incoming messages
socket.on('chat message', function (msg) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');  // Add the class 'message' to each new message
    messageElement.textContent = msg;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;  // Auto scroll to bottom
});

// Send message on button click
document.getElementById('send-btn').onclick = function () {
    sendMessage();
};

// Send message on 'Enter' key press
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
        messageInput.value = '';  // Clear input field after sending
    }
}
