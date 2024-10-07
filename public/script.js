const socket = io();

function requestUsername() {
    let username = prompt("What should we call you?");
    while (username.trim() === '') {
        username = prompt("Please provide a username.");
    }
    socket.emit('set username', username);
}

requestUsername();

// Handle server response for username validation
socket.on('username taken', (message) => {
    document.getElementById("username").textContent = "You";
    alert(message);
    requestUsername();
});

socket.on('username accepted', (username) => {
    document.getElementById("username").textContent = username;
});

// Display incoming messages
socket.on('chat message', function (msg) {
    if (msg && msg.senderId && msg.senderUsername && msg.content && msg.timestamp) {
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
            senderId: socket.id,
            senderUsername: document.getElementById("username").textContent,
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

    if (message.senderId === socket.id) {
        messageElement.classList.add('own');
    }

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');

    const senderElement = document.createElement('div');
    senderElement.classList.add('message-sender');
    senderElement.textContent = message.senderUsername;

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

function changeUsername(message) {
    if (confirm("Change username? \n⚠️Chat will be refreshed")) {
        location.reload();
    }
}
