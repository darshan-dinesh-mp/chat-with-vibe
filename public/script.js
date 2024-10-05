const socket = io();

const username = prompt("What should we call you?");
socket.emit('set username', username);


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
            sender: username || 'You',
            content: content,
            timestamp: new Date()
        };
        socket.emit('chat message', message);
        messageInput.value = '';
    }
});

function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (message.sender === username) {
        messageElement.classList.add('own');
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
