import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const chat = model.startChat({ history: [], generationConfig: { maxOutputTokens: 500 } });

        const result = await chat.sendMessageStream(message);
        let responseText = "";
        for await (const chunk of result.stream) {
            responseText += await chunk.text();
        }
        
        res.json({ reply: responseText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server läuft auf Port 3000"));
