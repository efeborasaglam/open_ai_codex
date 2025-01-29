import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

async function run() {
    try {
        // Wechsel auf ein unterstütztes Modell (gemini-1.5-flash oder gemini-1.5-pro)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Was denkst du aus welchem land kommt her, du musst vermuten";

        const imagePart = [fileToGenerativePart("lele.jpg", "image/jpeg")];

        // Anfrage an die API
        const response = await model.generateContent([prompt, ...imagePart]);

        const text = await response.response.text();
        console.log(text);
    } catch (error) {
        console.error("Fehler:", error);
    }
}

run();
