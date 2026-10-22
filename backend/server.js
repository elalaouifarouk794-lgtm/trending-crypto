
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "20kb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "TrendAI Helper",
    status: "online",
    mode: "education-and-paper-trading"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/ask", async (req, res) => {
  try {
    const question = req.body?.question;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "كتب السؤال ديالك أولا."
      });
    }

    if (question.length > 1000) {
      return res.status(400).json({
        error: "السؤال طويل بزاف؛ الحد هو 1000 حرف."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "AI غير مهيّأ: زيد GEMINI_API_KEY فإعدادات السيرفر."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text:
                "You are TrendAI, an educational cryptocurrency market assistant. " +
                "Explain crypto concepts, volatility, and risks in clear language. " +
                "Never promise profits or guaranteed price increases. " +
                "Do not claim to know live prices unless verified data is supplied. " +
                "Do not execute trades or request passwords, seed phrases, or private keys. " +
                "Explain that paper trading is simulated and not real money."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: question.trim() }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 700
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return res.status(502).json({
        error: "تعذر على AI الإجابة دابا. تأكد من إعدادات Gemini."
      });
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!answer) {
      return res.status(502).json({
        error: "AI ما رجّع حتى جواب. جرّب مرة أخرى."
      });
    }

    return res.json({ answer });
  } catch (error) {
    console.error("API request failed:", error.message);

    return res.status(500).json({
      error: "وقع خطأ فالسيرفر. عاود المحاولة."
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`TrendAI backend running on port ${PORT}`);
});
