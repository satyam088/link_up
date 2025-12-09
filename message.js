
const chats = [
    {
    id: 1,
    name: "Ananya Singh",
    initials: "AS",
    role: "SDE Intern · Java | React",
    lastSeen: "Online",
    lastMessageTime: "2m",
    messages: [
        { from: "them", text: "Hey Satyam! Did you finish the DSA sheet?", time: "10:05" },
        { from: "me", text: "Almost, I’m at 45/50 questions 👀", time: "10:06" },
        { from: "them", text: "Nice! Let’s discuss 2 hard ones later.", time: "10:08" }
    ]
    },
    {
    id: 2,
    name: "Rohan Verma",
    initials: "RV",
    role: "Backend · Node.js | MongoDB",
    lastSeen: "2 hours ago",
    lastMessageTime: "2h",
    messages: [
        { from: "me", text: "Bro, did you deploy your Node app?", time: "18:22" },
        { from: "them", text: "Yes, on Render. I’ll send you the link.", time: "18:30" }
    ]
    },
    {
    id: 3,
    name: "Priya Sharma",
    initials: "PS",
    role: "Frontend · React | UI",
    lastSeen: "Yesterday",
    lastMessageTime: "1d",
    messages: [
        { from: "them", text: "Your LinkUp UI looks clean 🔥", time: "21:10" },
        { from: "me", text: "Thank you! Still improving it 😄", time: "21:12" }
    ]
    }
];

let currentChatId = null;

const chatListEl = document.getElementById("chatList");
const chatMessagesEl = document.getElementById("chatMessages");
const chatUserNameEl = document.getElementById("chatUserName");
const chatUserRoleEl = document.getElementById("chatUserRole");
const chatUserLastSeenEl = document.getElementById("chatUserLastSeen");
const chatUserAvatarEl = document.getElementById("chatUserAvatar");
const chatFormEl = document.getElementById("chatForm");
const chatInputEl = document.getElementById("chatInput");
const chatSearchEl = document.getElementById("chatSearch");

function renderChatList(filterText = "") {
    chatListEl.innerHTML = "";
    const text = filterText.toLowerCase();

    chats
    .filter(chat => chat.name.toLowerCase().includes(text))
    .forEach(chat => {
        const item = document.createElement("div");
        item.className = "chat-item" + (chat.id === currentChatId ? " chat-item-active" : "");
        item.dataset.id = chat.id;

        item.innerHTML = `
        <div class="chat-item-avatar">${chat.initials}</div>
        <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="chat-item-name">${chat.name}</span>
            <span class="chat-item-time">${chat.lastMessageTime}</span>
            </div>
            <div class="chat-item-last">
            ${chat.messages[chat.messages.length - 1]?.text || ""}
            </div>
        </div>
        `;

        item.addEventListener("click", () => selectChat(chat.id));
        chatListEl.appendChild(item);
    });
}

function selectChat(id) {
    currentChatId = id;
    const chat = chats.find(c => c.id === id);
    if (!chat) return;

    chatUserNameEl.textContent = chat.name;
    chatUserRoleEl.textContent = chat.role;
    chatUserLastSeenEl.textContent = chat.lastSeen;
    chatUserAvatarEl.textContent = chat.initials;

    renderChatMessages(chat);
    renderChatList(chatSearchEl.value);
}

function renderChatMessages(chat) {
    chatMessagesEl.innerHTML = "";
    if (!chat.messages.length) {
    chatMessagesEl.innerHTML =
        '<p style="font-size:13px; color:var(--text-muted); text-align:center; margin-top:40px;">No messages yet. Say hi 👋</p>';
    return;
    }

    chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "chat-message " + (msg.from === "me" ? "from-me" : "from-them");
    div.innerHTML = `
        ${msg.text}
        <span class="chat-message-time">${msg.time}</span>
    `;
    chatMessagesEl.appendChild(div);
    });

    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

chatFormEl.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = chatInputEl.value.trim();
    if (!text || !currentChatId) return;

    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    const now = new Date();
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

    chat.messages.push({ from: "me", text, time });
    chat.lastMessageTime = "now";

    chatInputEl.value = "";
    renderChatMessages(chat);
    renderChatList(chatSearchEl.value);
});

chatSearchEl.addEventListener("input", function () {
    renderChatList(this.value);
});

// Initial render
renderChatList();
// Auto-select first chat
if (chats.length > 0) {
    selectChat(chats[0].id);
}
