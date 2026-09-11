import React from 'react';

interface ProjectOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectOverviewModal: React.FC<ProjectOverviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(203, 213, 225, 0.8)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 30px rgba(59, 130, 246, 0.15)',
          color: '#1e293b',
          boxSizing: 'border-box',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
                  Campus Companion
                </h2>
                <span
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  Hackathon Build
                </span>
              </div>
              <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                Project Overview, Technical Architecture & System Walkthrough
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(241, 245, 249, 0.8)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            ✕
          </button>
        </div>

        {/* 1. The Core Mission */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(240, 253, 250, 0.8))',
            border: '1px solid #bfdbfe',
            borderRadius: '16px',
            padding: '18px 20px',
            marginBottom: '24px'
          }}
        >
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#1e40af', fontWeight: 700 }}>
            🎯 The Problem We Solve
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.5' }}>
            Campus logistics are traditionally fragmented across chaotic WhatsApp groups, lost item bulletin boards, and static PDFs. <strong>Campus Companion</strong> unifies study room tracking, lost & found claiming, live events discovery, and an intelligent NLP assistant into a single fast, engaging portal.
          </p>
        </div>

        {/* 2. Four Pillars Grid */}
        <h3 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
          🏛️ The 4 Mission-Critical Modules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            {
              icon: '🏢',
              title: 'Study Spaces',
              color: '#059669',
              bg: '#ecfdf5',
              border: '#a7f3d0',
              desc: 'Live room occupancy monitoring and real-time status toggles.'
            },
            {
              icon: '🔍',
              title: 'Lost & Found',
              color: '#2563eb',
              bg: '#eff6ff',
              border: '#bfdbfe',
              desc: 'Authenticated reporting, timestamping, and one-click claim workflow.'
            },
            {
              icon: '📅',
              title: 'Campus Events',
              color: '#d97706',
              bg: '#fffbeb',
              border: '#fde68a',
              desc: 'Curated calendar recommendations with calendar export.'
            },
            {
              icon: '🤖',
              title: 'AI Assistant',
              color: '#7c3aed',
              bg: '#faf5ff',
              border: '#e9d5ff',
              desc: 'Contextual natural language engine connected to live database state.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, color: item.color, fontSize: '0.95rem', marginBottom: '4px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.4' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 3. System Architecture & Two-Tier Stack */}
        <h3 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
          ⚡ Two-Tier Technical Architecture
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🪐</span>
              <strong style={{ color: '#0f172a' }}>Frontend (Port 3000)</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
              <li><strong>React 19 & TypeScript</strong> for strict type-safety.</li>
              <li><strong>Three.js + React Three Fiber</strong> for 60 FPS 3D canvas.</li>
              <li><strong>3D-Anchored &lt;Html&gt;</strong> projection moving with 3D models.</li>
              <li><strong>React Router v7</strong> with deep-linked URL tab states.</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <strong style={{ color: '#0f172a' }}>Backend (Port 5000)</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#475569', lineHeight: '1.6' }}>
              <li><strong>Node.js & Express 5</strong> REST API endpoints.</li>
              <li><strong>Socket.io</strong> multi-client real-time synchronization.</li>
              <li><strong>NLP Intent Engine</strong> (<code style={{ background: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>processChatMessage</code>) querying live state.</li>
              <li>In-memory database store with instant response times.</li>
            </ul>
          </div>
        </div>

        {/* 4. Future Scope & Roadmap */}
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
          🔮 Scalability & Future Roadmap
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '4px' }}>
              1. IoT Room Sensors
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
              PIR sensors & Wi-Fi density metrics to automatically toggle room occupancy.
            </div>
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '4px' }}>
              2. LLM RAG System
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
              Connect Gemini or Claude with university handbooks and policies.
            </div>
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '4px' }}>
              3. RFID Check-ins
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
              NFC student card tap-in at library turnstiles for automatic desk hold.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            Explore Live Application →
          </button>
        </div>
      </div>
    </div>
  );
};
