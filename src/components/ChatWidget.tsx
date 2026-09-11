import React, { useState } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { sendChatMessage } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const ChatWidget: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your Campus Companion. You can ask me about open study spaces, lost items, or upcoming workshops.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(userMsg.text);
      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: res.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: 'Sorry, I had trouble contacting the campus server. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickPrompts = [
    'Where can I study right now?',
    'What events are happening?',
    'Did anyone find a lost ID card?'
  ];

  return (
    <Glass
      style={{
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        marginBottom: '24px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b', fontWeight: 700 }}>
            🤖 Campus AI Assistant
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Instant answers for space inquiries, lost belongings, and schedules.
          </p>
        </div>
      </div>

      {/* Message Stream */}
      <div
        style={{
          maxHeight: '260px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '12px',
          background: 'rgba(248, 250, 252, 0.8)',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          marginBottom: '14px'
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: isUser ? '#3b82f6' : '#ffffff',
                color: isUser ? '#ffffff' : '#1e293b',
                padding: '10px 14px',
                borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                border: isUser ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}
            >
              <div>{m.text}</div>
              <div
                style={{
                  fontSize: '0.7rem',
                  marginTop: '4px',
                  textAlign: 'right',
                  color: isUser ? 'rgba(255,255,255,0.8)' : '#94a3b8'
                }}
              >
                {m.time}
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Assistant is thinking...
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            style={{
              padding: '6px 12px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            💬 {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about campus..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#ffffff',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 20px',
            background: loading || !input.trim() ? '#94a3b8' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          Send
        </button>
      </form>
    </Glass>
  );
};
