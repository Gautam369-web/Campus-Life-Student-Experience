import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchLostItems, fetchSpaces, fetchEvents } from '../services/api';

export const Dashboard: React.FC = () => {
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [lostRes, spacesRes, eventsRes] = await Promise.all([
          fetchLostItems(),
          fetchSpaces(),
          fetchEvents()
        ]);
        setLostItems(lostRes);
        setSpaces(spacesRes);
        setEvents(eventsRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Glass style={{ background: 'rgba(255,255,0,0.2)', padding: 20, borderRadius: 16 }}>
        <p>Loading dashboard...</p>
      </Glass>
    );
  }

  if (error) {
    return (
      <Glass style={{ background: 'rgba(255,0,0,0.2)', padding: 20, borderRadius: 16 }}>
        <p>Error loading dashboard: {error}</p>
      </Glass>
    );
  }

  const lostCount = lostItems.filter(item => item.status !== 'claimed').length;
  const claimedCount = lostItems.filter(item => item.status === 'claimed').length;
  const freeSpaces = spaces.filter(s => !s.occupied).length;
  const totalSpaces = spaces.length;
  const upcomingEvents = events.filter(e => new Date(e.startsAt) > new Date()).length;

  return (
    <Glass style={{ background: 'rgba(0,255,0,0.1)', padding: 20, borderRadius: 16, marginBottom: 20 }}>
      <h2 style={{ color: '#333' }}>Campus Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
        <div style={{ background: 'rgba(200,200,255,0.2)', padding: 16, borderRadius: 12 }}>
          <h3 style={{ color: '#0066cc' }}>Lost & Found</h3>
          <p><strong>{lostCount}</strong> items lost</p>
          <p><strong>{claimedCount}</strong> claimed</p>
        </div>
        <div style={{ background: 'rgba(200,255,200,0.2)', padding: 16, borderRadius: 12 }}>
          <h3 style={{ color: '#009900' }}>Space Availability</h3>
          <p><strong>{freeSpaces}</strong> of <strong>{totalSpaces}</strong> spaces free</p>
          <p>{freeSpaces === 0 ? 'All occupied!' : 'Plenty of space!'}</p>
        </div>
        <div style={{ background: 'rgba(255,255,200,0.2)', padding: 16, borderRadius: 12 }}>
          <h3 style={{ color: '#cc9900' }}>Events</h3>
          <p><strong>{upcomingEvents}</strong> upcoming events</p>
          <p>{upcomingEvents === 0 ? 'Nothing scheduled' : 'Check the feed!'}</p>
        </div>
        <div style={{ background: 'rgba(255,200,200,0.2)', padding: 16, borderRadius: 12, minHeight: 120 }}>
          <h3 style={{ color: '#cc0000' }}>Campus Map</h3>
          <div style={{ width: '100%', height: '100px', background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Map placeholder (replace with actual map)
          </div>
        </div>
      </div>
    </Glass>
  );
};
