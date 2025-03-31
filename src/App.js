import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("https://bot-operacyjny-692847427928.europe-central2.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: { text: question },
          sender: { email: "agata@example.com" }
        })
      });

      const data = await response.json();
      setAnswer(data.text || "Brak odpowiedzi.");
    } catch (error) {
      setAnswer("❌ Błąd podczas komunikacji z botem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {showSplash ? (
        <div className="splash-screen">
          <img src="splash.png" alt="PEDROżer ładuje..." />
          <p className="splash-text">How! How! Odpowiedź w drodze...</p>
        </div>
      ) : (
        <div className="chatbox">
          <img src="pedro-logo.png" alt="PEDROżer" className="logo-img" />
          <h1>PEDROżer</h1>

          <input
            type="text"
            placeholder="Zadaj pytanie..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </button>

          {loading && (
            <div className="pedro-loader">
              <p>PEDROżer kopie...</p>
            </div>
          )}

          {answer && !loading && (
            <div
              className="response"
              dangerouslySetInnerHTML={{
                __html: answer
                  .replace(
                    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
                    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">$1</a>'
                  )
                  .replace(
                    /(?<!href=")(https?:\/\/[^\s]+)/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">$1</a>'
                  )
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;



