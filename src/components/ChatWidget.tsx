import React, { useState } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { sendChatMessage } from '../services/api';

export const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await sendChatMessage(message);
      setResponse(res.response);
      setMessage('');
    } catch (err) {
      setResponse('Error: could not reach server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Glass style={{ background: 'rgba(255,255,255,0.8)', padding: 20, borderRadius: 16, maxWidth: 400 }}>
      <h2>Campus Assistant</h2>
      <div style={{ marginBottom: 12 }}>
        <p>{response || 'Ask me about lost items, free spaces, or events.'}</p>
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your question..."
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: loading ? '#9e9e9e' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Ask'}
        </button>
      </form>
    </Glass>
  );
};
