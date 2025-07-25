require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

exports.generateRoomAI = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  let systemPrompt = "";
  try {
    systemPrompt = fs.readFileSync(
      path.join(__dirname, "../prompts/aiPrompt.txt"),
      "utf-8"
    );
  } catch (readErr) {
    console.error("Eroare la citirea promptului AI:", readErr);
    return res.status(500).json({ error: "Prompt file could not be loaded." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    console.log("🔍 GPT response:\n", content);
    if (!content) {
      console.error("GPT response was empty or malformed:", data);
      return res.status(502).json({ error: "No response from AI or invalid format." });
    }

    let json;
    try {
      const cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();

      json = JSON.parse(cleaned);
    } catch (err) {
      console.error("Invalid JSON returned by AI:", content);
      return res.status(500).json({ error: "AI response is not valid JSON." });
    }

    return res.json(json);
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
};
