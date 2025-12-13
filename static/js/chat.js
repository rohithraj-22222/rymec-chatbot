let year = null;

const messages = document.getElementById("messages");
const input = document.getElementById("input");

function add(text, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Loading screen logic (2 seconds)
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("chatbox").style.display = "flex";

    add(
      "Hi, I’m Chatbot@RYMEC.\nWhich year are you in and what do you need?\n(Curriculum / Syllabus / Faculty)",
      "bot"
    );
  }, 2000);
});

function sendMessage() {
  const text = input.value;
  if (!text.trim()) return;

  input.value = "";
  add(text, "user");

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, year: year })
  })
  .then(res => res.json())
  .then(data => {
    if (data.year) year = data.year;
    add(data.reply, "bot");
  });
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

