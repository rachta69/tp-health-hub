export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message, history } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 1,
        messages: [
          {
            role: "system",
            content: "คุณคือ AI ผู้ช่วยด้านสุขภาพ ตอบแบบเป็นกันเอง ให้คำแนะนำหลายทาง และเหมือน ChatGPT"
          },
          ...(history || []),
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI:", data);

    if (data.error) {
      return res.status(500).json({
        reply: "❌ ERROR: " + data.error.message
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        reply: "❌ ไม่มีคำตอบจาก AI"
      });
    }

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "❌ SERVER ERROR"
    });
  }
}
