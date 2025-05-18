const socket = io()

let currentRoom = "global" // Default room

function requestUsername() {
  let username = prompt("What should we call you?")
  while (username.trim() === "") {
    username = prompt("Please provide a username.")
  }
  socket.emit("set username", username)
}

requestUsername()

// Handle server response for username validation
socket.on("username taken", (message) => {
  document.getElementById("username").textContent = "You"
  alert(message)
  requestUsername()
})

socket.on("username accepted", (username) => {
  document.getElementById("username").textContent = username
})

// Function to join or create a room
function joinRoom() {
  const room = document.getElementById("roomInput").value.trim()
  if (room) {
    socket.emit("join room", room) // Emit event to join room
    currentRoom = room // Update current room
    document.getElementById("roomInput").value = "" // Clear input

    // Update room badge
    document.getElementById("currentRoomBadge").textContent = `ROOM: ${room.toUpperCase()}`

    // Add system message for room join
    const joinMessage = {
      id: Date.now(),
      senderId: "system",
      senderUsername: "SYSTEM",
      content: `You joined room: ${room}`,
      timestamp: new Date(),
      isSystem: true,
    }
    addMessage(joinMessage)
  }
}

// Display incoming messages
socket.on("chat message", (msg) => {
  if (msg && msg.senderId && msg.senderUsername && msg.content && msg.timestamp) {
    addMessage(msg)
  }
})

// Function to send the message
const messageForm = document.getElementById("messageForm")
const messageInput = document.getElementById("messageInput")

messageForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const content = messageInput.value.trim()
  if (content) {
    const message = {
      id: Date.now(),
      senderId: socket.id,
      senderUsername: document.getElementById("username").textContent,
      content: content,
      timestamp: new Date(),
      room: currentRoom,
    }
    socket.emit("chat message", message)
    messageInput.value = ""
  }
})

function createMessageElement(message) {
  const messageElement = document.createElement("div")
  messageElement.classList.add("message")

  if (message.isSystem) {
    // Style system messages differently
    messageElement.style.backgroundColor = "#1a1a2e"
    messageElement.style.color = "#05d9e8"
    messageElement.style.maxWidth = "100%"
    messageElement.style.textAlign = "center"
    messageElement.style.padding = "0.5rem"
    messageElement.style.margin = "0.5rem auto"
    messageElement.style.borderRadius = "4px"
    messageElement.style.fontSize = "0.85rem"
    messageElement.style.textTransform = "uppercase"
    messageElement.style.letterSpacing = "1px"
    messageElement.style.border = "1px solid #2a2a3a"
    messageElement.style.boxShadow = "0 0 10px rgba(5, 217, 232, 0.2)"
    messageElement.textContent = message.content
    return messageElement
  }

  if (message.senderId === socket.id) {
    messageElement.classList.add("own")
  }

  const contentElement = document.createElement("div")
  contentElement.classList.add("message-content")

  const senderElement = document.createElement("div")
  senderElement.classList.add("message-sender")
  senderElement.textContent = message.senderUsername

  const textElement = document.createElement("div")
  textElement.textContent = message.content

  const timeElement = document.createElement("div")
  timeElement.classList.add("message-time")
  timeElement.textContent = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  contentElement.appendChild(senderElement)
  contentElement.appendChild(textElement)
  messageElement.appendChild(contentElement)
  messageElement.appendChild(timeElement)

  return messageElement
}

function addMessage(message) {
  const messageElement = createMessageElement(message)
  const chatMessages = document.getElementById("chatMessages")
  chatMessages.appendChild(messageElement)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function changeUsername(message) {
  if (confirm("Change username? \n⚠️Chat will be refreshed")) {
    location.reload()
  }
}

const textarea = document.getElementById('messageInput');
const form = document.getElementById('messageForm');

textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
    }
});