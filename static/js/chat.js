let year = null;
let branch = null;

const messages = document.getElementById("messages");

function add(text, cls) {
  const div = document.createElement("div");
  div.className = cls;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

add(
  "Hi, I’m Chatbot@RYMEC.\nWhich year you are in?\nWhich branch you are in?\nWhat do you need? (Syllabus / Faculty)\n\n[EX: 1 ME Faculty]\n\nHere is the list of branch:\nCSE, CIVIL, ECE, EEE, ME",
  "bot"
);

function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  add(text, "user");
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      year: year,
      branch: branch
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.year) year = data.year;
    if (data.branch) branch = data.branch;
    add(data.reply, "bot");
  });
}

document.getElementById("input").addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});


