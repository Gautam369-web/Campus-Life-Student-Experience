import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './components/Dashboard';
import { SpaceAvailability } from './components/SpaceAvailability';
import { LostFound } from './components/LostFound';
import { EventFeed } from './components/EventFeed';
import { ChatWidget } from './components/ChatWidget';
import { LandingPage } from './pages/LandingPage';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'spaces' | 'lost' | 'events' | 'chat'>('all');

  const handleEnterDashboard = () => {
    setShowLandingPage(false);
  };

  if (showLandingPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #f8fafc 100%)',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #f8fafc 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#1e293b',
        padding: '24px 16px 48px'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(203, 213, 225, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.4rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              🎓
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                Campus Companion
              </h1>
              <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                Unified Student Experience & Campus Life Platform
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#15803d'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
              Server Online (Port 5000)
            </span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          <button
            onClick={() => setShowLandingPage(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: 'rgba(255, 255, 255, 0.85)',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            🏠 Home Intro
          </button>
          {[
            { id: 'all', label: '📊 All-in-One Dashboard' },
            { id: 'spaces', label: '🏢 Study Spaces' },
            { id: 'lost', label: '🔍 Lost & Found' },
            { id: 'events', label: '📅 Events Feed' },
            { id: 'chat', label: '🤖 AI Assistant' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.75)',
                  color: isActive ? '#ffffff' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Contents */}
        {activeTab === 'all' && (
          <div>
            {/* Top Pulse / Metric Overview */}
            <Dashboard onNavigateTab={(tab) => setActiveTab(tab as any)} />

            {/* Main Interactive Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '24px'
              }}
            >
              <div>
                <SpaceAvailability />
                <ChatWidget />
              </div>
              <div>
                <LostFound />
                <EventFeed />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spaces' && (
          <div>
            <Dashboard onNavigateTab={(tab) => setActiveTab(tab as any)} />
            <SpaceAvailability />
          </div>
        )}

        {activeTab === 'lost' && (
          <div>
            <Dashboard onNavigateTab={(tab) => setActiveTab(tab as any)} />
            <LostFound />
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <Dashboard onNavigateTab={(tab) => setActiveTab(tab as any)} />
            <EventFeed />
          </div>
        )}

        {activeTab === 'chat' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <ChatWidget />
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            marginTop: '40px',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.85rem'
          }}
        >
          Campus Companion • Live Hackathon Build
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
