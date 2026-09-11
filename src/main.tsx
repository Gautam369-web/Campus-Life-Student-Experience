import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import './index.css';
import { Dashboard } from './components/Dashboard';
import { SpaceAvailability } from './components/SpaceAvailability';
import { LostFound } from './components/LostFound';
import { EventFeed } from './components/EventFeed';
import { ChatWidget } from './components/ChatWidget';
import { LandingPage } from './pages/LandingPage';

type TabType = 'all' | 'spaces' | 'lost' | 'events' | 'chat';

// Main app component (the dashboard with tabs)
const MainApp: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlTab = searchParams.get('tab') as TabType | null;
  const validTabs: TabType[] = ['all', 'spaces', 'lost', 'events', 'chat'];
  const initialTab: TabType = urlTab && validTabs.includes(urlTab) ? urlTab : 'all';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams(tab === 'all' ? {} : { tab });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #f8fafc 100%)',
        fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
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
            <button
              onClick={() => navigate('/')}
              title="Return to 3D Campus Experience"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = '#334155';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              🪐 3D Universe
            </button>

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
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', fontFamily: 'var(--font-heading)' }}>
                Campus Companion
              </h1>
              <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                Unified Student Experience & Campus Life Platform
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#15803d'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'liveBeacon 2s infinite' }}></span>
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
                onClick={() => handleTabChange(tab.id as TabType)}
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
            <Dashboard onNavigateTab={(tab) => handleTabChange(tab as TabType)} />

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
            <Dashboard onNavigateTab={(tab) => handleTabChange(tab as TabType)} />
            <SpaceAvailability />
          </div>
        )}

        {activeTab === 'lost' && (
          <div>
            <Dashboard onNavigateTab={(tab) => handleTabChange(tab as TabType)} />
            <LostFound />
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <Dashboard onNavigateTab={(tab) => handleTabChange(tab as TabType)} />
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
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MainApp />} />
        {/* Redirect any other path to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
