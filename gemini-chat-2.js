import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let isAwaitingResponse = false; // Flag, um mehrere Anfragen gleichzeitig zu vermeiden

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    function askAndRespond() {
        if (!isAwaitingResponse) {
            rl.question("You: ", async (msg) => {
                if (msg.toLowerCase() === "exit") {
                    console.log("Goodbye!");
                    rl.close();
                    return;
                }

                isAwaitingResponse = true;
                try {
                    const result = await chat.sendMessageStream(msg);
                    let responseText = "";

                    process.stdout.write("StudyChat: "); // AI antwortet in einer Zeile

                    for await (const chunk of result.stream) {
                        const chunkText = await chunk.text();
                        responseText += chunkText;
                        process.stdout.write(chunkText); // Antwort wird fortlaufend ausgegeben
                    }

                    console.log("\n"); // Neue Zeile nach vollständiger Antwort
                    isAwaitingResponse = false;
                    askAndRespond();
                } catch (error) {
                    console.error("\nError:", error);
                    isAwaitingResponse = false;
                }
            });
        } else {
            console.log("Please wait for the current response to complete.");
        }
    }

    askAndRespond();
}

run();
