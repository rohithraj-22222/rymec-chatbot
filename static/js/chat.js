let year = null;
let branch = null;
let messages = null;

document.addEventListener("DOMContentLoaded", () => {
  // Show loading for 2 seconds
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("chatbox").style.display = "flex";
  }, 2000);

  // Now messages div exists
  messages = document.getElementById("messages");

  // Welcome message
  add(
    "Hi, I’m Chatbot@RYMEC.\n" +
    "Which year you are in?\n" +
    "Which branch you are in?\n" +
    "What do you need? (Syllabus / Faculty)\n\n" +
    "[EX: 1 ME Faculty]\n\n" +
    "Branches:\nCSE, CIVIL, ECE, EEE, ME, AIML\n",
    "bot"
  );
});

function add(text, cls) {
  if (!messages) return;

  const div = document.createElement("div");
  div.className = cls;

  // Convert URLs into clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const html = text.replace(
    urlRegex,
    url => `<a href="${url}" target="_blank" style="color:#1f3c88; font-weight:bold;"> LINK </a>`
  );

  div.innerHTML = html.replace(/\n/g, "<br>");
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  add(text, "user");
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, year, branch })
  })
    .then(res => res.json())
    .then(data => {
      if (data.year) year = data.year;
      if (data.branch) branch = data.branch;
      add(data.reply, "bot");
    });
}

document.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});









