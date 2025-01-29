import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    async function askRespond() {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit") {
                rl.close();
                return;
            }

            let retries = 3;
            while (retries > 0) {
                try {
                    const result = await chat.sendMessage(msg);
                    const response = await result.response;
                    const text = await response.text();
                    console.log("AI:", text);
                    break;
                } catch (error) {
                    if (error.status === 503) {
                        console.error("Server überlastet. Warte 5 Sekunden...");
                        await new Promise((resolve) => setTimeout(resolve, 5000));
                        retries--;
                    } else {
                        console.error("Fehler bei der API-Anfrage:", error);
                        break;
                    }
                }
            }

            askRespond();
        });
    }

    askRespond();
}

run();
