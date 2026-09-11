const API_BASE = 'http://localhost:5000/api';

export interface LostItem {
  id?: string;
  title: string;
  description: string;
  lastSeenAt?: string;
  reportedAt?: string;
  location?: { lat: number; lng: number };
  status?: string;
}

export interface Space {
  id: string;
  name: string;
  occupied: boolean;
  building: string;
}

export interface CampusEvent {
  id?: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  tags?: string[];
}

export const fetchLostItems = async (): Promise<LostItem[]> => {
  const response = await fetch(`${API_BASE}/lost`);
  return response.json();
};

export const addLostItem = async (item: Partial<LostItem>): Promise<LostItem> => {
  const response = await fetch(`${API_BASE}/lost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
};

export const updateLostItem = async (id: string, updates: Partial<LostItem>): Promise<LostItem> => {
  const response = await fetch(`${API_BASE}/lost/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return response.json();
};

export const fetchSpaces = async (): Promise<Space[]> => {
  const response = await fetch(`${API_BASE}/spaces`);
  return response.json();
};

export const updateSpace = async (id: string, updates: Partial<Space>): Promise<Space> => {
  const response = await fetch(`${API_BASE}/spaces/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return response.json();
};

export const fetchEvents = async (): Promise<CampusEvent[]> => {
  const response = await fetch(`${API_BASE}/events`);
  return response.json();
};

export const addEvent = async (event: Partial<CampusEvent>): Promise<CampusEvent> => {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  return response.json();
};

export const fetchEventRecommendations = async (): Promise<CampusEvent[]> => {
  const response = await fetch(`${API_BASE}/events/recommend`);
  return response.json();
};

export const sendChatMessage = async (message: string): Promise<{ response: string }> => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return response.json();
};

export type NoiseCategory = 'whisper' | 'quiet' | 'moderate' | 'lively';
export type CrowdHeatLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface TelemetryZone {
  id: string;
  name: string;
  building: string;
  floor: string;
  zoneType: 'silent' | 'collaborative' | 'social' | 'lab';
  capacity: number;
  currentOccupancy: number;
  decibelLevel: number;
  noiseCategory: NoiseCategory;
  crowdHeat: CrowdHeatLevel;
  powerOutletsAvailable: number;
  powerStatus: 'plentiful' | 'moderate' | 'scarce';
  wifiSpeedMbps: number;
  wifiLatencyMs: number;
  airQualityAqi: number;
  amenities: string[];
  coordinates: { x: number; y: number; width: number; height: number };
}

export const fetchTelemetryZones = async (): Promise<TelemetryZone[]> => {
  const response = await fetch(`${API_BASE}/telemetry`);
  return response.json();
};

export const simulateTelemetryMode = async (mode: 'rush' | 'quiet' | 'reset'): Promise<{ success: boolean; mode: string; telemetryZones: TelemetryZone[] }> => {
  const response = await fetch(`${API_BASE}/telemetry/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode })
  });
  return response.json();
};

