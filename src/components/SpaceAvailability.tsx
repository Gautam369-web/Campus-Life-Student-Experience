import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchSpaces, updateSpace, Space } from '../services/api';

export const SpaceAvailability: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSpaces = async () => {
    try {
      const data = await fetchSpaces();
      setSpaces(data);
    } catch (err) {
      console.error('Failed to load spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
    const interval = setInterval(loadSpaces, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleOccupancy = async (space: Space) => {
    setUpdatingId(space.id);
    try {
      const updated = await updateSpace(space.id, { occupied: !space.occupied });
      setSpaces(prev => prev.map(s => s.id === space.id ? updated : s));
    } catch (err) {
      console.error('Failed to toggle space status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const freeCount = spaces.filter(s => !s.occupied).length;

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
            Study Spaces & Labs
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Find available study spots across campus. Click "Toggle" to update room status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ padding: '6px 12px', background: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
            ● {freeCount} Free
          </span>
          <span style={{ padding: '6px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
            ● {spaces.length - freeCount} Occupied
          </span>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Checking space availability...</p>
      ) : spaces.length === 0 ? (
        <p style={{ color: '#64748b' }}>No spaces listed.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          {spaces.map((space) => {
            const isFree = !space.occupied;
            return (
              <div
                key={space.id}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: isFree
                    ? 'linear-gradient(145deg, rgba(240, 253, 244, 0.9), rgba(220, 252, 231, 0.7))'
                    : 'linear-gradient(145deg, rgba(254, 242, 242, 0.9), rgba(254, 226, 226, 0.7))',
                  border: isFree ? '1px solid #bbf7d0' : '1px solid #fecaca',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: isFree ? '#22c55e' : '#ef4444',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {isFree ? 'Available' : 'Occupied'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {space.building}</span>
                  </div>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '1.05rem', color: '#1e293b' }}>
                    {space.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    {isFree ? 'Quiet spot ready for study' : 'Currently in use by students'}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleOccupancy(space)}
                  disabled={updatingId === space.id}
                  style={{
                    marginTop: '14px',
                    padding: '8px 12px',
                    background: isFree ? '#15803d' : '#b91c1c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: updatingId === space.id ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    opacity: updatingId === space.id ? 0.6 : 1
                  }}
                >
                  {updatingId === space.id ? 'Updating...' : isFree ? 'Mark as Occupied' : 'Mark as Free'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Glass>
  );
};
