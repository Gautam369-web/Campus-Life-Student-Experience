import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchLostItems, fetchSpaces, fetchEvents, LostItem, Space, CampusEvent } from '../services/api';

interface DashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
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

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  const lostCount = lostItems.filter(item => item.status !== 'claimed').length;
  const claimedCount = lostItems.filter(item => item.status === 'claimed').length;
  const freeSpaces = spaces.filter(s => !s.occupied).length;
  const totalSpaces = spaces.length;
  const upcomingEvents = events.filter(e => new Date(e.startsAt) > new Date()).length;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b', fontWeight: 700 }}>
            Campus Pulse
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Live status of spaces, lost belongings, and campus happenings
          </p>
        </div>
        <button
          onClick={loadData}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem' }}>
          ⚠️ Notice: {error}. (Ensure backend server is running on port 5000)
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Lost & Found Stat Card */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('lost')}
          style={{
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(219, 234, 254, 0.6))',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(191, 219, 254, 0.8)',
            cursor: onNavigateTab ? 'pointer' : 'default',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem' }}>🔍</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '20px' }}>
              {claimedCount} Claimed
            </span>
          </div>
          <h3 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#1e40af' }}>Lost & Found</h3>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#1d4ed8' }}>
            {lostCount}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#3b82f6' }}>
            {lostCount === 0 ? 'No open lost items' : 'Items waiting to be claimed'}
          </p>
        </div>

        {/* Space Availability Stat Card */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('spaces')}
          style={{
            background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8), rgba(220, 252, 231, 0.6))',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(187, 247, 208, 0.8)',
            cursor: onNavigateTab ? 'pointer' : 'default',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: freeSpaces > 0 ? '#16a34a' : '#dc2626', background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '20px' }}>
              {freeSpaces > 0 ? `${freeSpaces} Free` : 'Full'}
            </span>
          </div>
          <h3 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#166534' }}>Study Spaces</h3>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#15803d' }}>
            {freeSpaces} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#4ade80' }}>/ {totalSpaces}</span>
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#16a34a' }}>
            {freeSpaces === 0 ? 'All study rooms occupied' : 'Open desks available right now'}
          </p>
        </div>

        {/* Events Stat Card */}
        <div
          onClick={() => onNavigateTab && onNavigateTab('events')}
          style={{
            background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.8), rgba(253, 230, 138, 0.6))',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(252, 211, 77, 0.8)',
            cursor: onNavigateTab ? 'pointer' : 'default',
            transition: 'transform 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem' }}>📅</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '20px' }}>
              Upcoming
            </span>
          </div>
          <h3 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#92400e' }}>Campus Events</h3>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#b45309' }}>
            {upcomingEvents}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#d97706' }}>
            {upcomingEvents === 0 ? 'Nothing scheduled today' : 'Workshops, hackathons & talks'}
          </p>
        </div>

        {/* Quick Map Stat Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.8), rgba(237, 233, 254, 0.6))',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(221, 214, 254, 0.8)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem' }}>🗺️</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6d28d9', background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '20px' }}>
              Live
            </span>
          </div>
          <h3 style={{ margin: '12px 0 4px', fontSize: '1rem', color: '#5b21b6' }}>Campus Map</h3>
          <div
            style={{
              height: '42px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              color: '#6d28d9',
              marginTop: '8px',
              fontWeight: 500
            }}
          >
            📍 Central Campus Hub
          </div>
        </div>
      </div>
    </Glass>
  );
};
