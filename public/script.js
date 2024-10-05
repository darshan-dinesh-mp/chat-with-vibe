const socket = io();

// Display incoming messages
socket.on('chat message', function (msg) {
    if (msg && msg.sender && msg.content && msg.timestamp) {
        addMessage(msg);
    }
});

// Function to send the message
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (content) {
        const message = {
            id: Date.now(),
            sender: 'You', // Mark this message as from 'You'
            content: content,
            timestamp: new Date()
        };
        socket.emit('chat message', message);  // Send message to server
        messageInput.value = '';  // Clear input field
    }
});

function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Check if the sender ID matches the current user's ID
    if (message.senderId === socket.id) {
        messageElement.classList.add('own'); // Align own messages to the right
    }

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');

    const senderElement = document.createElement('div');
    senderElement.classList.add('message-sender');
    senderElement.textContent = message.sender || 'Anonymous';

    const textElement = document.createElement('div');
    textElement.textContent = message.content;

    const timeElement = document.createElement('div');
    timeElement.classList.add('message-time');
    timeElement.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    contentElement.appendChild(senderElement);
    contentElement.appendChild(textElement);
    messageElement.appendChild(contentElement);
    messageElement.appendChild(timeElement);

    return messageElement;
}
function addMessage(message) {
    const messageElement = createMessageElement(message);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
