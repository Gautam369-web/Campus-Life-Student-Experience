import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchEventRecommendations } from '../services/api';

export const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEventRecommendations();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
    const interval = setInterval(loadEvents, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <Glass style={{ background: 'rgba(255,255,205,0.3)', padding: 20, borderRadius: 16 }}>
      <p>Loading events...</p>
    </Glass>
  );

  return (
    <Glass style={{ background: 'rgba(255,255,205,0.3)', padding: 20, borderRadius: 16, marginBottom: 20 }}>
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {events.map((event, index) => (
            <li key={event.id || index} style={{ background: 'rgba(255,255,255,0.5)', padding: 12, marginBottom: 8, borderRadius: 8 }}>
              <strong>{event.title}</strong><br />
              <small>{event.description}</small><br />
              <small>When: {new Date(event.startsAt).toLocaleString()} - {new Date(event.endsAt).toLocaleTimeString()}</small><br />
              <small>Where: {event.location}</small>
              <br />
              <button
                onClick={() => {
                  // In a real app, we would add to calendar
                  alert(`Added "${event.title}" to calendar!`);
                }}
                style={{ marginTop: 8, padding: '4px 8px', background: '#ff9800', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                Add to Calendar
              </button>
            </li>
          ))}
        </ul>
      )}
    </Glass>
  );
};
