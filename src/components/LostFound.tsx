import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchLostItems, addLostItem, updateLostItem } from '../services/api';

export const LostFound: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', lastSeenAt: '', location: { lat: 0, lng: 0 } });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchLostItems();
      setItems(data);
    };
    loadItems();
    const interval = setInterval(loadItems, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.description.trim()) return;
    setLoading(true);
    try {
      const item = await addLostItem({
        title: newItem.title,
        description: newItem.description,
        lastSeenAt: newItem.lastSeenAt || new Date().toISOString(),
        location: newItem.location,
        status: 'lost'
      });
      setItems(prev => [item, ...prev]);
      setNewItem({ title: '', description: '', lastSeenAt: '', location: { lat: 0, lng: 0 } });
    } catch (err) {
      console.error('Failed to add lost item:', err);
      alert('Failed to report lost item');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimItem = async (id: string) => {
    try {
      await updateLostItem(id, { status: 'claimed' });
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'claimed' } : item));
    } catch (err) {
      console.error('Failed to claim item:', err);
      alert('Failed to claim item');
    }
  };

  return (
    <Glass style={{ background: 'rgba(255,235,205,0.3)', padding: 20, borderRadius: 16, marginBottom: 20 }}>
      <h2>Lost & Found</h2>
      <div style={{ marginBottom: 16 }}>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={newItem.title}
            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
            placeholder="Item title (e.g., Blue ID card)"
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 120 }}
          />
          <input
            value={newItem.description}
            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Description"
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 120 }}
          />
          <input
            value={newItem.lastSeenAt}
            onChange={e => setNewItem({ ...newItem, lastSeenAt: e.target.value })}
            placeholder="Last seen (ISO timestamp, optional)"
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 120 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#9e9e9e' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Reporting...' : 'Report Lost'}
          </button>
        </form>
      </div>
      {items.length === 0 ? (
        <p>No lost items reported.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item, index) => (
            <li key={item.id || index} style={{ background: 'rgba(255,255,255,0.5)', padding: 12, marginBottom: 8, borderRadius: 8 }}>
              <strong>{item.title}</strong>: {item.description || 'No description'} <br />
              <small>Last seen: {new Date(item.lastSeenAt || item.reportedAt).toLocaleString()}</small>
              {item.status !== 'claimed' && (
                <button
                  onClick={() => handleClaimItem(item.id)}
                  style={{ marginTop: 8, padding: '4px 8px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                  Claim
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Glass>
  );
};
