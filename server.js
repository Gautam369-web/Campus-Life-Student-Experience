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

// Initial Digital Twin Telemetry Zones
let telemetryZones = [
  {
    id: 'z1',
    name: 'Library Level 3 - Silent Alcove',
    building: 'Main Library',
    floor: 'Level 3',
    zoneType: 'silent',
    capacity: 40,
    currentOccupancy: 12,
    decibelLevel: 31,
    noiseCategory: 'whisper',
    crowdHeat: 'low',
    powerOutletsAvailable: 18,
    powerStatus: 'plentiful',
    wifiSpeedMbps: 520,
    wifiLatencyMs: 4,
    airQualityAqi: 18,
    amenities: ['Dual 4K Monitors', 'Ergonomic Mesh Chairs', 'Natural Daylight', 'Private Carrels'],
    coordinates: { x: 5, y: 10, width: 42, height: 38 }
  },
  {
    id: 'z2',
    name: 'Innovation Center - Tech Pods',
    building: 'Innovation Center',
    floor: 'Ground Floor',
    zoneType: 'lab',
    capacity: 50,
    currentOccupancy: 34,
    decibelLevel: 46,
    noiseCategory: 'quiet',
    crowdHeat: 'moderate',
    powerOutletsAvailable: 24,
    powerStatus: 'plentiful',
    wifiSpeedMbps: 850,
    wifiLatencyMs: 2,
    airQualityAqi: 22,
    amenities: ['High-Power Workstations', 'Standing Desks', 'Soldering Benches', 'Ethernet Jacks'],
    coordinates: { x: 52, y: 10, width: 43, height: 38 }
  },
  {
    id: 'z3',
    name: 'Student Union - Atrium Commons',
    building: 'Student Union',
    floor: 'Level 1',
    zoneType: 'social',
    capacity: 120,
    currentOccupancy: 95,
    decibelLevel: 72,
    noiseCategory: 'lively',
    crowdHeat: 'high',
    powerOutletsAvailable: 6,
    powerStatus: 'scarce',
    wifiSpeedMbps: 310,
    wifiLatencyMs: 12,
    airQualityAqi: 35,
    amenities: ['Coffee Bar Access', 'Lounge Sofas', 'Campus Music', 'Food Courts'],
    coordinates: { x: 5, y: 53, width: 42, height: 40 }
  },
  {
    id: 'z4',
    name: 'Science Complex - Collaborative Hall',
    building: 'Science Complex',
    floor: 'Level 2',
    zoneType: 'collaborative',
    capacity: 60,
    currentOccupancy: 28,
    decibelLevel: 51,
    noiseCategory: 'moderate',
    crowdHeat: 'moderate',
    powerOutletsAvailable: 15,
    powerStatus: 'plentiful',
    wifiSpeedMbps: 460,
    wifiLatencyMs: 5,
    airQualityAqi: 20,
    amenities: ['Floor-to-Ceiling Whiteboards', 'Group Discussion Pods', 'Projector Screens'],
    coordinates: { x: 52, y: 53, width: 43, height: 40 }
  },
  {
    id: 'z5',
    name: 'Engineering Hall - Mezzanine Loft',
    building: 'Block 20 Engineering',
    floor: 'Mezzanine',
    zoneType: 'silent',
    capacity: 30,
    currentOccupancy: 8,
    decibelLevel: 34,
    noiseCategory: 'whisper',
    crowdHeat: 'low',
    powerOutletsAvailable: 12,
    powerStatus: 'plentiful',
    wifiSpeedMbps: 600,
    wifiLatencyMs: 3,
    airQualityAqi: 19,
    amenities: ['Silent Study', 'Adjustable Lighting', 'Noise Cancelling Dividers'],
    coordinates: { x: 5, y: 98, width: 42, height: 35 }
  },
  {
    id: 'z6',
    name: 'Campus Center - Cyber Cafe',
    building: 'Campus Center',
    floor: 'Level 2',
    zoneType: 'collaborative',
    capacity: 70,
    currentOccupancy: 48,
    decibelLevel: 58,
    noiseCategory: 'moderate',
    crowdHeat: 'moderate',
    powerOutletsAvailable: 11,
    powerStatus: 'moderate',
    wifiSpeedMbps: 420,
    wifiLatencyMs: 8,
    airQualityAqi: 28,
    amenities: ['Espresso Machines', 'Outdoor Terrace', 'Group Booths'],
    coordinates: { x: 52, y: 98, width: 43, height: 35 }
  }
];

// Helper to calculate noise and heat categories
function classifyZone(decibels, occupancyRatio) {
  let noiseCategory = 'whisper';
  if (decibels > 65) noiseCategory = 'lively';
  else if (decibels > 50) noiseCategory = 'moderate';
  else if (decibels > 38) noiseCategory = 'quiet';

  let crowdHeat = 'low';
  if (occupancyRatio > 0.85) crowdHeat = 'critical';
  else if (occupancyRatio > 0.65) crowdHeat = 'high';
  else if (occupancyRatio > 0.35) crowdHeat = 'moderate';

  return { noiseCategory, crowdHeat };
}

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

// Telemetry & Acoustic Heatmap Endpoints
app.get('/api/telemetry', (req, res) => {
  res.json(telemetryZones);
});

app.post('/api/telemetry/simulate', (req, res) => {
  const { mode } = req.body;
  if (mode === 'rush') {
    telemetryZones = telemetryZones.map(zone => {
      const occ = Math.min(zone.capacity, Math.floor(zone.capacity * (0.82 + Math.random() * 0.15)));
      const decibels = Math.min(88, zone.zoneType === 'silent' ? 44 + Math.floor(Math.random() * 8) : 68 + Math.floor(Math.random() * 18));
      const { noiseCategory, crowdHeat } = classifyZone(decibels, occ / zone.capacity);
      const outlets = Math.max(1, Math.floor(zone.powerOutletsAvailable * 0.3));
      return { ...zone, currentOccupancy: occ, decibelLevel: decibels, noiseCategory, crowdHeat, powerOutletsAvailable: outlets };
    });
  } else if (mode === 'quiet') {
    telemetryZones = telemetryZones.map(zone => {
      const occ = Math.max(2, Math.floor(zone.capacity * (0.12 + Math.random() * 0.15)));
      const decibels = Math.max(26, zone.zoneType === 'silent' ? 28 + Math.floor(Math.random() * 5) : 38 + Math.floor(Math.random() * 10));
      const { noiseCategory, crowdHeat } = classifyZone(decibels, occ / zone.capacity);
      const outlets = Math.min(zone.capacity, Math.floor(zone.capacity * 0.6));
      return { ...zone, currentOccupancy: occ, decibelLevel: decibels, noiseCategory, crowdHeat, powerOutletsAvailable: outlets };
    });
  } else if (mode === 'reset') {
    // Reset to balanced state
    telemetryZones[0].decibelLevel = 31; telemetryZones[0].currentOccupancy = 12;
    telemetryZones[1].decibelLevel = 46; telemetryZones[1].currentOccupancy = 34;
    telemetryZones[2].decibelLevel = 72; telemetryZones[2].currentOccupancy = 95;
    telemetryZones[3].decibelLevel = 51; telemetryZones[3].currentOccupancy = 28;
    telemetryZones[4].decibelLevel = 34; telemetryZones[4].currentOccupancy = 8;
    telemetryZones[5].decibelLevel = 58; telemetryZones[5].currentOccupancy = 48;
    telemetryZones.forEach(z => {
      const { noiseCategory, crowdHeat } = classifyZone(z.decibelLevel, z.currentOccupancy / z.capacity);
      z.noiseCategory = noiseCategory;
      z.crowdHeat = crowdHeat;
    });
  }

  io.emit('telemetryUpdate', telemetryZones);
  res.json({ success: true, mode, telemetryZones });
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

  // Acoustic telemetry / quietest spot intent
  if (lower.includes('quiet') || lower.includes('silent') || lower.includes('noise') || lower.includes('decibel') || lower.includes('sound') || lower.includes('loud') || lower.includes('calm')) {
    // Find zone with lowest decibels and available seats
    const available = [...telemetryZones].filter(z => z.currentOccupancy < z.capacity);
    available.sort((a, b) => a.decibelLevel - b.decibelLevel);
    if (available.length > 0) {
      const best = available[0];
      const freeSeats = best.capacity - best.currentOccupancy;
      return `🎧 The quietest spot right now is "${best.name}" (${best.building}) registering only ${best.decibelLevel} dB (${best.noiseCategory.toUpperCase()} mode). There are ${freeSeats} open seats and ${best.powerOutletsAvailable} AC power outlets available!`;
    }
  }

  // Power outlet intent
  if (lower.includes('power') || lower.includes('outlet') || lower.includes('plug') || lower.includes('charge')) {
    const powerZones = [...telemetryZones].sort((a, b) => b.powerOutletsAvailable - a.powerOutletsAvailable);
    const best = powerZones[0];
    return `⚡ Best charging spot: "${best.name}" with ${best.powerOutletsAvailable} available AC outlets and Wi-Fi 6 at ${best.wifiSpeedMbps} Mbps!`;
  }

  // Lost and found intent
  if (lower.includes('lost') || lower.includes('found') || lower.includes('missing') || lower.includes('have you seen')) {
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
    const item = items[0];
    return `I found "${item.title}" last seen at ${new Date(item.lastSeenAt || item.reportedAt).toLocaleTimeString()}. You can claim it at the Lost and Found desk.`;
  }

  // Space availability intent
  if (lower.includes('study') || lower.includes('space') || lower.includes('room') || lower.includes('where can i') || lower.includes('free')) {
    const freeSpaces = spaces.filter(s => !s.occupied);
    if (freeSpaces.length === 0) {
      return "All standard study spaces are currently occupied, but check the Campus Heatmap for real-time open zone pods!";
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
  return "I can help you with quiet study spots, live noise/outlets, lost items, room bookings, or upcoming events! What would you like to know?";
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  // Send current state on connection
  socket.emit('lostItemsUpdate', lostItems);
  socket.emit('spacesUpdate', spaces);
  socket.emit('eventsUpdate', events);
  socket.emit('telemetryUpdate', telemetryZones);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Organic sensor pulse simulation (subtle live fluctuations for demo)
setInterval(() => {
  if (telemetryZones.length > 0) {
    // Pick 1-2 random zones to jitter slightly
    const idx = Math.floor(Math.random() * telemetryZones.length);
    const zone = telemetryZones[idx];
    const dbDelta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
    const newDb = Math.max(25, Math.min(85, zone.decibelLevel + dbDelta));
    const occDelta = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const newOcc = Math.max(0, Math.min(zone.capacity, zone.currentOccupancy + occDelta));
    
    const { noiseCategory, crowdHeat } = classifyZone(newDb, newOcc / zone.capacity);
    telemetryZones[idx] = {
      ...zone,
      decibelLevel: newDb,
      currentOccupancy: newOcc,
      noiseCategory,
      crowdHeat
    };

    io.emit('telemetryUpdate', telemetryZones);
  }
}, 6000);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

