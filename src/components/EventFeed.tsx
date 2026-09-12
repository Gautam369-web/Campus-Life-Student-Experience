import React, { useState, useEffect } from 'react';
import { Glass } from "@samasante/liquid-glass";
import io from 'socket.io-client';
import {
  fetchEvents,
  addEvent,
  rsvpEvent,
  getGoogleCalendarUrl,
  CampusEvent,
  EventCategory
} from '../services/api';

export const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [myRsvps, setMyRsvps] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Event Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EventCategory>('tech');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStartsAt, setFormStartsAt] = useState('');
  const [formEndsAt, setFormEndsAt] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load events
  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    // Socket.io for live event updates
    const socket = io('http://localhost:5000');
    socket.on('eventsUpdate', (updated: CampusEvent[]) => {
      if (Array.isArray(updated)) {
        setEvents(updated);
      }
    });

    const interval = setInterval(loadEvents, 8000);
    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRsvpToggle = async (event: CampusEvent) => {
    if (!event.id) return;
    const isAttending = myRsvps.has(event.id);
    const action = isAttending ? 'leave' : 'join';

    // Optimistic UI update
    setMyRsvps(prev => {
      const next = new Set(prev);
      if (isAttending) next.delete(event.id!);
      else next.add(event.id!);
      return next;
    });

    try {
      const res = await rsvpEvent(event.id, action);
      if (res && res.event) {
        setEvents(prev => prev.map(e => e.id === event.id ? res.event : e));
        showToast(isAttending ? `Left ${event.title}` : `🎉 RSVP confirmed for ${event.title}!`);
      }
    } catch (err) {
      console.error('RSVP failed:', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLocation || !formStartsAt) {
      alert('Please fill in Title, Location, and Start Time.');
      return;
    }

    setSubmitting(true);
    try {
      const tagList = formTags
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      const starts = new Date(formStartsAt).toISOString();
      const ends = formEndsAt
        ? new Date(formEndsAt).toISOString()
        : new Date(new Date(formStartsAt).getTime() + 7200000).toISOString(); // +2h default

      const newEv = await addEvent({
        title: formTitle,
        description: formDescription || 'Student-organized campus activity. Join in and collaborate!',
        category: formCategory,
        organizer: formOrganizer || 'Campus Student Initiative',
        location: formLocation,
        startsAt: starts,
        endsAt: ends,
        tags: tagList.length > 0 ? tagList : ['campus', formCategory],
        attendeesCount: 1,
        isFeatured: false
      });

      if (newEv && newEv.id) {
        setMyRsvps(prev => new Set(prev).add(newEv.id!));
      }

      setIsModalOpen(false);
      // Reset form
      setFormTitle('');
      setFormOrganizer('');
      setFormLocation('');
      setFormStartsAt('');
      setFormEndsAt('');
      setFormTags('');
      setFormDescription('');
      showToast(`🚀 "${formTitle}" is now live on the Campus Feed!`);
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('Failed to publish event. Ensure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for dynamic timing badges
  const getTimeStatus = (startsAt: string, endsAt: string) => {
    const now = Date.now();
    const start = new Date(startsAt).getTime();
    const end = new Date(endsAt).getTime();

    if (now >= start && now <= end) {
      return { label: '🔴 LIVE NOW', bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
    }
    const diffMins = Math.round((start - now) / 60000);
    if (diffMins > 0 && diffMins <= 60) {
      return { label: `⏳ Starts in ${diffMins}m`, bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    }
    if (diffMins > 60 && diffMins <= 360) {
      const hours = Math.round(diffMins / 60);
      return { label: `⏳ Today in ${hours}h`, bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
    }
    const dateStr = new Date(startsAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
    return { label: `📅 ${dateStr}`, bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
  };

  // Helper for category styling
  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'tech':
        return { label: '💻 Tech & AI', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
      case 'hackathon':
        return { label: '🏆 Hackathon', bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
      case 'cultural':
        return { label: '🎨 Cultural & Arts', bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' };
      case 'career':
        return { label: '💼 Career & Jobs', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
      case 'sports':
        return { label: '🎮 Esports & Sports', bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      default:
        return { label: '📌 Campus Event', bg: '#f8fafc', color: '#334155', border: '#e2e8f0' };
    }
  };

  // Filtered list
  const filteredEvents = events.filter(e => {
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.organizer && e.organizer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredEvent = events.find(e => e.isFeatured) || events[0];
  const totalRsvps = events.reduce((sum, e) => sum + (e.attendeesCount || 1), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'floatGentle 0.3s ease'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Main Glass Header & Quick Actions */}
      <Glass
        style={{
          display: 'block',
          width: '100%',
          boxSizing: 'border-box',
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(16px)',
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b', fontWeight: 800 }}>
                Campus Happenings & Events
              </h2>
            </div>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Real-time student club workshops, hackathons, cultural festivals, and esports tournaments.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', background: '#fef3c7', color: '#b45309', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              👥 {totalRsvps} Total RSVPs
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '9px 18px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>➕</span>
              <span>Host Campus Event</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search events by title, club organizer, venue, or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 16px 12px 42px',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.9rem',
                color: '#1e293b',
                outline: 'none',
                transition: 'border 0.2s ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'all', label: `🌟 All Events (${events.length})` },
              { id: 'tech', label: '💻 Tech & AI' },
              { id: 'hackathon', label: '🏆 Hackathons' },
              { id: 'cultural', label: '🎨 Cultural & Arts' },
              { id: 'career', label: '💼 Career & Jobs' },
              { id: 'sports', label: '🎮 Esports & Sports' }
            ].map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    background: isSelected ? '#2563eb' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </Glass>

      {/* Featured Spotlight Banner (Shown when filtering 'all' and search is empty) */}
      {selectedCategory === 'all' && !searchQuery && featuredEvent && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              ⭐ FEATURED EVENT OF THE WEEK
            </span>
            <span style={{ background: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
              👥 {featuredEvent.attendeesCount || 100}+ Registered
            </span>
          </div>

          <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
            {featuredEvent.title}
          </h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.92rem', maxWidth: '750px', lineHeight: 1.5 }}>
            {featuredEvent.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', opacity: 0.95 }}>
            <span>📍 {featuredEvent.location}</span>
            <span>🏛️ {featuredEvent.organizer || 'Campus Council'}</span>
            <span>🕒 {new Date(featuredEvent.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleRsvpToggle(featuredEvent)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: myRsvps.has(featuredEvent.id || '') ? '#10b981' : '#ffffff',
                color: myRsvps.has(featuredEvent.id || '') ? '#ffffff' : '#1e3a8a',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {myRsvps.has(featuredEvent.id || '') ? '✓ You Are Attending' : '🤝 RSVP / Join Event'}
            </button>

            <a
              href={getGoogleCalendarUrl(featuredEvent)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(8px)'
              }}
            >
              📅 Add to Google Calendar
            </a>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          ⏳ Loading campus events feed...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: '#ffffff', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
          <span style={{ fontSize: '2.5rem' }}>🎈</span>
          <h3 style={{ margin: '12px 0 4px', color: '#1e293b' }}>No Events Found</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
            No events match your current search or category filter. Click <strong>"+ Host Campus Event"</strong> to create one!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredEvents.map(event => {
            const isAttending = event.id ? myRsvps.has(event.id) : false;
            const timeStatus = getTimeStatus(event.startsAt, event.endsAt);
            const categoryBadge = getCategoryBadge(event.category);

            return (
              <div
                key={event.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div>
                  {/* Category & Time Status Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: categoryBadge.bg,
                        color: categoryBadge.color,
                        border: `1px solid ${categoryBadge.border}`
                      }}
                    >
                      {categoryBadge.label}
                    </span>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: timeStatus.bg,
                        color: timeStatus.color,
                        border: `1px solid ${timeStatus.border}`
                      }}
                    >
                      {timeStatus.label}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '10px' }}>
                    🏛️ {event.organizer || 'Campus Club'}
                  </div>

                  {/* Description */}
                  <p style={{ margin: '0 0 16px', color: '#475569', fontSize: '0.88rem', lineHeight: 1.45 }}>
                    {event.description}
                  </p>

                  {/* Logistics Specs */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8rem',
                      color: '#334155',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '14px'
                    }}
                  >
                    <div>
                      📍 <strong>Location:</strong> {event.location}
                    </div>
                    <div>
                      🕒 <strong>Time:</strong> {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                      {event.tags.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      👥 {event.attendeesCount || 1} Students Attending
                    </span>
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Add to Google Calendar"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#475569',
                        textDecoration: 'none',
                        background: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}
                    >
                      📅 Calendar ↗
                    </a>
                  </div>

                  <button
                    onClick={() => handleRsvpToggle(event)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isAttending ? '#10b981' : '#2563eb',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: isAttending
                        ? '0 4px 12px rgba(16, 185, 129, 0.25)'
                        : '0 4px 12px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isAttending ? '✓ You Are Attending' : '🤝 RSVP / Join Event'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Host Campus Event Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              width: '100%',
              maxWidth: '540px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  Host a Campus Event
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Publish club activities, hackathons, or workshops live to all students.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intro to Docker & Cloud Deployment"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="tech">💻 Tech & AI</option>
                    <option value="hackathon">🏆 Hackathon</option>
                    <option value="cultural">🎨 Cultural & Arts</option>
                    <option value="career">💼 Career & Jobs</option>
                    <option value="sports">🎮 Esports & Sports</option>
                    <option value="general">📌 General Campus</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Organizing Club / Society
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coding Society"
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT Block - Room 304 or Zoom Link"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartsAt}
                    onChange={(e) => setFormStartsAt(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formEndsAt}
                    onChange={(e) => setFormEndsAt(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. devops, docker, career, free food"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide schedule details, prerequisites, and what students will gain..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                  }}
                >
                  {submitting ? 'Publishing...' : '🚀 Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
