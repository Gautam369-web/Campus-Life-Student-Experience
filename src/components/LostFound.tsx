import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import { fetchLostItems, addLostItem, updateLostItem, LostItem } from '../services/api';

export const LostFound: React.FC = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadItems = async () => {
    try {
      const data = await fetchLostItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load lost items:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    const interval = setInterval(loadItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const item = await addLostItem({
        title: title.trim(),
        description: description.trim() + (location ? ` (Last seen: ${location})` : ''),
        lastSeenAt: new Date().toISOString(),
        status: 'lost'
      });
      setItems(prev => [item, ...prev]);
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (err) {
      console.error('Failed to add lost item:', err);
      alert('Failed to report lost item');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimItem = async (id?: string) => {
    if (!id) return;
    try {
      await updateLostItem(id, { status: 'claimed' });
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'claimed' } : item));
    } catch (err) {
      console.error('Failed to claim item:', err);
      alert('Failed to claim item');
    }
  };

  const activeItems = items.filter(i => i.status !== 'claimed');
  const claimedItems = items.filter(i => i.status === 'claimed');

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
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b', fontWeight: 700 }}>
            Lost & Found Desk
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Report misplaced belongings or help fellow students recover their lost items.
          </p>
        </div>
        <span style={{ padding: '4px 12px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
          {activeItems.length} active reported
        </span>
      </div>

      {/* Report Form */}
      <form
        onSubmit={handleAddItem}
        style={{
          background: 'rgba(248, 250, 252, 0.8)',
          padding: '16px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}
      >
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Item title (e.g., Blue Hydro Flask)"
          required
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#fff'
          }}
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (color, brand, stickers...)"
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#fff'
          }}
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location last seen (e.g., Library 2nd floor)"
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            background: '#fff'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : '+ Report Lost Item'}
        </button>
      </form>

      {/* Item Listings */}
      {initialLoading ? (
        <p style={{ color: '#64748b' }}>Loading lost items...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
          🎉 No lost items currently reported!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {items.map((item, index) => {
            const isClaimed = item.status === 'claimed';
            return (
              <div
                key={item.id || index}
                style={{
                  background: isClaimed ? 'rgba(241, 245, 249, 0.7)' : '#ffffff',
                  padding: '16px',
                  borderRadius: '14px',
                  border: isClaimed ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isClaimed ? 0.75 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', textDecoration: isClaimed ? 'line-through' : 'none' }}>
                      {item.title}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: isClaimed ? '#e2e8f0' : '#fee2e2',
                        color: isClaimed ? '#64748b' : '#dc2626'
                      }}
                    >
                      {isClaimed ? '✓ Claimed' : 'Missing'}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 8px', color: '#475569', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {item.description || 'No additional details provided'}
                  </p>
                  <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Reported: {new Date(item.lastSeenAt || item.reportedAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                {!isClaimed && (
                  <button
                    onClick={() => handleClaimItem(item.id)}
                    style={{
                      marginTop: '12px',
                      padding: '6px 12px',
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      alignSelf: 'flex-start'
                    }}
                  >
                    Claim this item
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Glass>
  );
};
