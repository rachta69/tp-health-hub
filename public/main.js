let history = [];

async function send(){
  const input = document.getElementById("input");
  const text = input.value.trim();
  if(!text) return;

  addMsg("user", text);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history: history
      })
    });

    const data = await res.json();

    addMsg("bot", data.reply);

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: data.reply });

  } catch (err) {
    addMsg("bot", "❌ เรียก API ไม่ได้");
    console.error(err);
  }
}

function addMsg(role, text){
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = text;
  document.getElementById("chat").appendChild(div);
}
