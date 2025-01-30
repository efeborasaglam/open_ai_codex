import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { text: "StudyAI schreibt", sender: "bot", isLoading: true },
    ]);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Formatierung für Codeblöcke
      const formattedReply = data.reply
        .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') // Codeblöcke
        .replace(/\n/g, '<br />'); // Zeilenumbrüche

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: formattedReply, sender: "bot" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Fehler: " + error.message, sender: "bot" },
      ]);
    }

    setIsLoading(false);
    setInput("");
  };

  return (
    <div className="row" style={{ backgroundColor: "#00407C" }}>
      <div className="border border-primary p-4">
        <center>
          <h2 className="mb-5 mt-1">StudyChat</h2>
        </center>
        <center>
          <div className="container d-flex justify-content-center">
            <div className="chat-box-container d-none d-lg-block ">
              <div className="bg-light p-3 rounded shadow chat-box">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    {msg.sender === "user" ? "You: " : "StudyAI: "}
                    {msg.isLoading ? (
                      <span className="loading-text">
                        StudyAI schreibt<span className="dots">...</span>
                      </span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ... (Rest des Codes bleibt unverändert) ... */}

          </div>
        </center>
        <div className="input-box mt-5" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;