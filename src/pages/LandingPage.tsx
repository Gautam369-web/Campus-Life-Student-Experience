import React, { useState } from 'react';
import { Glass } from "@samasante/liquid-glass";

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <Glass
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,245,245,0.7))',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          color: '#1e293b', 
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Campus Companion
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#64748b', 
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Your intelligent campus assistant for managing lost & found items, finding study spaces, and staying updated on campus events.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Lost & Found Feature */}
          <div
            onMouseEnter={() => setHoveredFeature('lost')}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: hoveredFeature === 'lost' 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: hoveredFeature === 'lost' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#1e40af', 
              marginBottom: '0.5rem'
            }}>Lost & Found</h3>
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#475569', 
              lineHeight: '1.5'
            }}>
              Report lost belongings, view found items, and help reunite owners with their possessions. Claim items with a single click.
            </p>
          </div>

          {/* Study Spaces Feature */}
          <div
            onMouseEnter={() => setHoveredFeature('spaces')}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: hoveredFeature === 'spaces' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: hoveredFeature === 'spaces' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏢</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#166534', 
              marginBottom: '0.5rem'
            }}>Study Spaces</h3>
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#475569', 
              lineHeight: '1.5'
            }}>
              Find available study rooms, libraries, and quiet zones in real-time. See which spaces are free right now and plan your study sessions effectively.
            </p>
          </div>

          {/* Campus Events Feature */}
          <div
            onMouseEnter={() => setHoveredFeature('events')}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: hoveredFeature === 'events' 
                ? 'rgba(245, 158, 11, 0.1)' 
                : 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: hoveredFeature === 'events' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#92400e', 
              marginBottom: '0.5rem'
            }}>Campus Events</h3>
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#475569', 
              lineHeight: '1.5'
            }}>
              Stay updated on workshops, hackathons, cultural events, and campus happenings. Never miss an important date or opportunity again.
            </p>
          </div>

          {/* AI Assistant Feature */}
          <div
            onMouseEnter={() => setHoveredFeature('assistant')}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: hoveredFeature === 'assistant' 
                ? 'rgba(139, 92, 246, 0.1)' 
                : 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: hoveredFeature === 'assistant' ? 'translateY(-4px)' : 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#7c3aed', 
              marginBottom: '0.5rem'
            }}>AI Assistant</h3>
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#475569', 
              lineHeight: '1.5'
            }}>
              Ask questions about lost items, study spaces, or events using natural language. Get instant help and recommendations from our intelligent assistant.
            </p>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.8)', 
          padding: '2rem', 
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            color: '#1e293b', 
            marginBottom: '1.5rem'
          }}>How It Works</h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            flexWrap: 'wrap', 
            gap: '1.5rem'
          }}>
            <div style={{ 
              textAlign: 'center', 
              flex: '1', 
              minWidth: '100px'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem'
              }}>1</div>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#475569'
              }}>Report or browse</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              flex: '1', 
              minWidth: '100px'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem'
              }}>2</div>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#475569'
              }}>Find or claim</p>
            </div>
            <div style={{ 
              textAlign: 'center', 
              flex: '1', 
              minWidth: '100px'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem'
              }}>3</div>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#475569'
              }}>Ask or explore</p>
            </div>
          </div>
        </div>

        <button
          onClick={onEnterDashboard}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          Get Started →
        </button>
      </div>
    </Glass>
  );
};
