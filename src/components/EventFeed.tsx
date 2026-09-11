import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchEventRecommendations, CampusEvent } from '../services/api';

export const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const loadEvents = async () => {
    try {
      const data = await fetchEventRecommendations();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveToCalendar = (event: CampusEvent) => {
    if (event.id) {
      setSavedIds(prev => new Set(prev).add(event.id!));
    }
    alert(`🎉 "${event.title}" has been added to your calendar!`);
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b', fontWeight: 700 }}>
            Campus Happenings & Events
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Recommended upcoming student club activities, tech workshops, and cultural fests.
          </p>
        </div>
        <span style={{ padding: '4px 12px', background: '#fef3c7', color: '#b45309', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
          {events.length} Upcoming
        </span>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Discovering upcoming campus events...</p>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
          No upcoming events scheduled right now. Check back soon!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {events.map((event, index) => {
            const isSaved = event.id ? savedIds.has(event.id) : false;
            return (
              <div
                key={event.id || index}
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #fde68a',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {event.tags && event.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '1.15rem' }}>
                    {event.title}
                  </h3>
                  <p style={{ margin: '0 0 12px', color: '#475569', fontSize: '0.88rem', lineHeight: '1.4' }}>
                    {event.description}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      🕒 <strong>Time:</strong> {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div>
                      📍 <strong>Location:</strong> {event.location}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSaveToCalendar(event)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 14px',
                    background: isSaved ? '#10b981' : '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {isSaved ? '✓ Added to Calendar' : '📅 Add to Calendar'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Glass>
  );
};
