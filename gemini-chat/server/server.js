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
        console.log("Anfrage erhalten:", req.body);
        const { message } = req.body;
        if (!message) throw new Error("Kein Nachrichteninhalt");

        const chat = model.startChat({ history: [], generationConfig: { maxOutputTokens: 500 } });
        console.log("Chat-Session gestartet");

        const result = await chat.sendMessageStream(message);
        let responseText = "";
        for await (const chunk of result.stream) {
            responseText += await chunk.text();
        }
        
        console.log("Antwort generiert:", responseText);
        res.json({ reply: responseText });
    } catch (error) {
        console.error("Fehler im API-Backend:", error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(3000, () => console.log("Server läuft auf Port 3000"));
