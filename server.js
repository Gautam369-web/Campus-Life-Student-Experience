const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory stores
let lostItems = [];
let spaces = [
  { id: 's1', name: 'Study Hall A', occupied: false, building: 'Block 10' },
  { id: 's2', name: 'Study Hall B', occupied: false, building: 'Block 10' },
  { id: 's3', name: 'Room 201', occupied: false, building: 'Block 20' },
  { id: 's4', name: 'Computer Lab', occupied: false, building: 'Block 30' },
  { id: 's5', name: 'Library Quiet Zone', occupied: false, building: 'Library' }
];
let events = [
  { id: 'e1', title: 'Python Workshop', description: 'Learn basics of Python', startsAt: new Date(Date.now() + 3600000).toISOString(), endsAt: new Date(Date.now() + 7200000).toISOString(), location: 'IT Building', tags: ['workshop', 'tech'] },
  { id: 'e2', title: 'Cultural Night', description: 'Music and dance performances', startsAt: new Date(Date.now() + 7200000).toISOString(), endsAt: new Date(Date.now() + 10800000).toISOString(), location: 'Auditorium', tags: ['cultural', 'entertainment'] },
  { id: 'e3', title: 'Hackathon Kickoff', description: 'Join the annual hackathon', startsAt: new Date(Date.now() + 10800000).toISOString(), endsAt: new Date(Date.now() + 14400000).toISOString(), location: 'Innovation Center', tags: ['hackathon', 'tech'] }
];

// Helper to find index by id
const findIndex = (arr, id) => arr.findIndex(item => item.id === id);

// API Routes

// Lost Items
app.get('/api/lost', (req, res) => {
  res.json(lostItems);
});

app.post('/api/lost', (req, res) => {
  const item = { id: uuidv4(), ...req.body, reportedAt: new Date().toISOString() };
  lostItems.push(item);
  io.emit('lostItemsUpdate', lostItems);
  res.status(201).json(item);
});

app.patch('/api/lost/:id', (req, res) => {
  const index = findIndex(lostItems, req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  lostItems[index] = { ...lostItems[index], ...req.body };
  io.emit('lostItemsUpdate', lostItems);
  res.json(lostItems[index]);
});

// Space Status
app.get('/api/spaces', (req, res) => {
  res.json(spaces);
});

app.patch('/api/spaces/:id', (req, res) => {
  const index = findIndex(spaces, req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Space not found' });
  spaces[index] = { ...spaces[index], ...req.body };
  io.emit('spacesUpdate', spaces);
  res.json(spaces[index]);
});

// Events
app.get('/api/events', (req, res) => {
  // Filter upcoming events
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.startsAt) > now);
  res.json(upcoming);
});

app.post('/api/events', (req, res) => {
  const event = { id: uuidv4(), ...req.body };
  events.push(event);
  io.emit('eventsUpdate', events);
  res.status(201).json(event);
});

app.get('/api/events/recommend', (req, res) => {
  // Simple recommendation: return all upcoming events for now
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.startsAt) > now);
  // In a real app, we would use user preferences and NLP
  res.json(upcoming.slice(0, 3)); // top 3
});

// Chat endpoint with simple NLP
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const response = processChatMessage(message);
  res.json({ response });
});

// Simple NLP function (rule-based)
function processChatMessage(text) {
  const lower = text.toLowerCase();

  // Lost and found intent
  if (lower.includes('lost') || lower.includes('found') || lower.includes('missing') || lower.includes('have you seen')) {
    // Extract possible item description (very naive)
    // Look for words after "lost" or "found"
    const lostMatch = lower.match(/lost\s+(.+)/i);
    const foundMatch = lower.match(/found\s+(.+)/i);
    const itemDesc = ((lostMatch && lostMatch[1]) || (foundMatch && foundMatch[1]) || '').toLowerCase();
    const items = lostItems.filter(item =>
      item.status !== 'claimed' &&
      (item.title.toLowerCase().includes(itemDesc) ||
       (item.description && item.description.toLowerCase().includes(itemDesc)))
    );
    if (items.length === 0) {
      return "I couldn't find any lost item matching that description.";
    }
    const item = items[0]; // most recent? we'll just take first
    return `I found "${item.title}" last seen at ${new Date(item.lastSeenAt || item.reportedAt).toLocaleTimeString()}. You can claim it at the Lost and Found desk.`;
  }

  // Space availability intent
  if (lower.includes('study') || lower.includes('space') || lower.includes('room') || lower.includes('where can i') || lower.includes('free')) {
    const freeSpaces = spaces.filter(s => !s.occupied);
    if (freeSpaces.length === 0) {
      return "All spaces are currently occupied.";
    }
    const names = freeSpaces.map(s => s.name).join(', ');
    return `Free spaces right now: ${names}.`;
  }

  // Events intent
  if (lower.includes('event') || lower.includes('happening') || lower.includes('workshop') || lower.includes('seminar') || lower.includes('cultural') || lower.includes('concert') || lower.includes('hackathon')) {
    const now = new Date();
    const upcoming = events.filter(e => new Date(e.startsAt) > now);
    if (upcoming.length === 0) {
      return "No upcoming events.";
    }
    const eventList = upcoming.map(e => `${e.title} at ${new Date(e.startsAt).toLocaleTimeString()}`).join('; ');
    return `Upcoming events: ${eventList}.`;
  }

  // Default fallback
  return "I'm not sure I understood. You can ask about lost items, free study spaces, or upcoming events.";
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  // Send current state on connection
  socket.emit('lostItemsUpdate', lostItems);
  socket.emit('spacesUpdate', spaces);
  socket.emit('eventsUpdate', events);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
