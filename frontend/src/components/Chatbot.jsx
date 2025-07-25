import React, { useState } from 'react';
import styles from './Chatbot.module.css';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyABYmZhAQtiD3RnNMMAQYy44RXYppkl3Ac'; // Replace with your actual Gemini API key

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      // Gemini API call
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Answer as a car expert: ${input}` }] }],
        }),
      });
      const data = await res.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not find an answer.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error contacting Gemini API.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setOpen((o) => !o)}>
        <span role="img" aria-label="chat">💬</span>
      </button>
      {open && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <span>Ask CarBot</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
          </div>
          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
                {msg.text}
              </div>
            ))}
            {loading && <div className={styles.botMsg}>Thinking...</div>}
          </div>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about cars..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 