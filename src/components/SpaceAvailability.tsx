import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchSpaces } from '../services/api';

export const SpaceAvailability: React.FC = () => {
  const [spaces, setSpaces] = useState<any[]>([]);

  useEffect(() => {
    const loadSpaces = async () => {
      const data = await fetchSpaces();
      setSpaces(data);
    };
    loadSpaces();
    const interval = setInterval(loadSpaces, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <Glass style={{ background: 'rgba(205,255,205,0.3)', padding: 20, borderRadius: 16, marginBottom: 20 }}>
      <h2>Space Availability</h2>
      {spaces.length === 0 ? (
        <p>Loading spaces...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {spaces.map((space) => (
            <div
              key={space.id}
              style={{
                padding: 12,
                borderRadius: 8,
                background: space.occupied ? 'rgba(255,99,71,0.3)' : 'rgba(144,238,144,0.3)',
                minWidth: 150,
                textAlign: 'center',
              }}
            >
              <strong>{space.name}</strong>
              <br />
              <small>{space.building}</small>
              <br />
              <span style={{ fontWeight: 'bold', color: space.occupied ? '#dc3545' : '#28a745' }}>
                {space.occupied ? 'Occupied' : 'Free'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Glass>
  );
};
