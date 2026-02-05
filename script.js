async function send() {
  const input = document.getElementById("msg");
  const chat = document.getElementById("chat");

  if (!input.value) return;

  chat.innerHTML += `<div class="message user">${input.value}</div>`;
  chat.scrollTop = chat.scrollHeight;

  const userMessage = input.value;
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await res.json();

  chat.innerHTML += `
    <div class="message ai">
      <strong>Sindre AI:</strong> ${data.reply}
    </div>
  `;

  chat.scrollTop = chat.scrollHeight;
}
