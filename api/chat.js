export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `
You are Sindre AI.

You are friendly, intelligent, calm, and slightly witty.
You explain things clearly and never talk down to the user.
You behave like a personal assistant, not a robot.
You keep answers concise unless the user asks for detail.
`
          },
          { role: "user", content: message }
        ]
      })
    }
  );

  const data = await response.json();
  res.status(200).json({
    reply: data.choices[0].message.content
  });
}
