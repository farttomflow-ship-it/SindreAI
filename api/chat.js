export default async function handler(req, res) {
  const { message } = req.body;

  // Check that the API key exists
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY missing");
    return res.status(500).json({ reply: "Server error: API key not set." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-13b", // ✅ Use a supported model here
        messages: [
          {
            role: "system",
            content: "You are Sindre AI. Friendly, intelligent, calm, and slightly witty. You explain things clearly and never talk down to the user."
          },
          { role: "user", content: message }
        ]
      })
    });

    // Log and handle API errors
    if (!response.ok) {
      const text = await response.text();
      console.error("API error:", response.status, text);
      return res.status(response.status).json({ reply: "Server error: API request failed." });
    }

    const data = await response.json();

    // Make sure the AI returned a valid message
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Invalid AI response:", data);
      return res.status(500).json({ reply: "Server error: No response from AI." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ reply: "Server error: Unable to reach AI." });
  }
}
