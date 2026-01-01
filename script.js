// Key used in localStorage
const STORAGE_KEY = "localChatMessages";

// DOM elements
const messagesList = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const userSelect = document.getElementById("userSelect");

// State
let messages = [];

// Load messages from localStorage on startup
function loadMessages() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    messages = [];
    return;
  }
  try {
    messages = JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse messages from localStorage", e);
    messages = [];
  }
}

// Save messages to localStorage
function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Format timestamp as HH:MM
function formatTime(dateString) {
  const d = new Date(dateString);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Render all messages to the UI
function renderMessages() {
  messagesList.innerHTML = "";

  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.classList.add("message");

    const isMe = msg.author === "You";
    li.classList.add(isMe ? "me" : "other");

    const header = document.createElement("div");
    header.classList.add("message-header");

    const authorSpan = document.createElement("span");
    authorSpan.classList.add("message-author");
    authorSpan.textContent = msg.author;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("message-time");
    timeSpan.textContent = formatTime(msg.createdAt);

    header.appendChild(authorSpan);
    header.appendChild(timeSpan);

    const textP = document.createElement("p");
    textP.classList.add("message-text");
    textP.textContent = msg.text;

    li.appendChild(header);
    li.appendChild(textP);

    messagesList.appendChild(li);
  });

  // Scroll to bottom after rendering
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Add a new message
function addMessage(text, author) {
  const newMessage = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    text,
    author,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  saveMessages();
  renderMessages();
}

// Handle form submit
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const author = userSelect.value;
  addMessage(text, author);

  messageInput.value = "";
  messageInput.focus();
});

// Initial setup
loadMessages();
renderMessages();
