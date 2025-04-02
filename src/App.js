import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setShowFeedback(false);

    try {
      const response = await fetch("https://bot-operacyjny-692847427928.europe-central2.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: {
            text: question,
            sender: { email: "agata@example.com" }
          }
        })
      });

      const data = await response.json();
      setAnswer(data.text || "Brak odpowiedzi.");
      setRawAnswer(data.answer || "");
      setShowFeedback(true);
    } catch (error) {
      setAnswer("❌ Błąd podczas komunikacji z botem.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedback) => {
    setShowFeedback(false);
    await fetch("https://bot-operacyjny-692847427928.europe-central2.run.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        feedback,
        question,
        answer: rawAnswer,
        message: {
          sender: { email: "agata@example.com" }
        }
      })
    });
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
            <div>
              <div
                className="response"
                dangerouslySetInnerHTML={{ __html: answer }}
              />
              {showFeedback && (
                <div className="feedback">
                  <p>Czy ta odpowiedź była pomocna?</p>
                  <button onClick={() => handleFeedback("tak")}>👍 Tak</button>
                  <button onClick={() => handleFeedback("nie")}>👎 Nie</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
