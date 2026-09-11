import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './components/Dashboard';
import { ChatWidget } from './components/ChatWidget';
import { Glass } from "@samasante/liquid-glass";

function App() {
  return (
    <div style={{ padding: 20, background: '#fafafa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Campus Companion</h1>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Dashboard />
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <ChatWidget />
          {/* Optional: a glass card showing some info */}
          <Glass style={{ background: 'rgba(255,255,255,0.7)', padding: 20, borderRadius: 16, flex: 1, minWidth: 280 }}>
            <h3>How to use</h3>
            <p>Report lost items, check free spaces, see upcoming events, and ask the assistant for help.</p>
          </Glass>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
