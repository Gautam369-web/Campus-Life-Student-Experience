import React, { useState, useEffect } from 'react';
import { Glass } from '@samasante/liquid-glass';
import io from 'socket.io-client';
import { fetchTelemetryZones, simulateTelemetryMode, TelemetryZone } from '../services/api';

const DEFAULT_ZONES: TelemetryZone[] = [
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

export const CampusHeatmap: React.FC = () => {
  const [zones, setZones] = useState<TelemetryZone[]>(DEFAULT_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('z1');
  const [filterType, setFilterType] = useState<string>('all');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);

  // Load telemetry from server
  const loadData = async () => {
    try {
      const data = await fetchTelemetryZones();
      if (Array.isArray(data) && data.length > 0) {
        setZones(data);
      }
    } catch {
      // Fallback to existing zones if server is quiet
    }
  };

  useEffect(() => {
    loadData();

    // Socket.io connection for real-time live telemetry
    const socket = io('http://localhost:5000');
    socket.on('telemetryUpdate', (updatedZones: TelemetryZone[]) => {
      if (Array.isArray(updatedZones) && updatedZones.length > 0) {
        setZones(updatedZones);
      }
    });

    // Gentle polling fallback
    const interval = setInterval(loadData, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  // Aggregated campus stats
  const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const avgDecibels = Math.round(zones.reduce((acc, z) => acc + z.decibelLevel, 0) / (zones.length || 1));
  const totalOutlets = zones.reduce((acc, z) => acc + z.powerOutletsAvailable, 0);

  // Filtered zones
  const filteredZones = filterType === 'all'
    ? zones
    : zones.filter(z => z.zoneType === filterType);

  // AI Smart Spot Pathfinder
  const runSmartPathfinder = (mode: 'focus' | 'power' | 'collab' | 'social') => {
    setActivePreset(mode);
    let bestZone: TelemetryZone = zones[0];

    if (mode === 'focus') {
      // Lowest decibels + available seat
      const available = [...zones].filter(z => z.currentOccupancy < z.capacity);
      available.sort((a, b) => a.decibelLevel - b.decibelLevel);
      bestZone = available[0] || zones[0];
    } else if (mode === 'power') {
      // Maximum outlets + high speed Wi-Fi
      const sorted = [...zones].sort((a, b) => (b.powerOutletsAvailable * 2 + b.wifiSpeedMbps * 0.05) - (a.powerOutletsAvailable * 2 + a.wifiSpeedMbps * 0.05));
      bestZone = sorted[0];
    } else if (mode === 'collab') {
      // Collaborative zone with whiteboards & moderate sound
      const collab = zones.filter(z => z.zoneType === 'collaborative' || z.amenities.some(a => a.toLowerCase().includes('whiteboard')));
      bestZone = collab[0] || zones[3];
    } else if (mode === 'social') {
      // Social/cafe zone
      const social = zones.filter(z => z.zoneType === 'social' || z.amenities.some(a => a.toLowerCase().includes('coffee')));
      bestZone = social[0] || zones[2];
    }

    setSelectedZoneId(bestZone.id);
  };

  // Trigger Judge Simulation Modes
  const handleSimulation = async (mode: 'rush' | 'quiet' | 'reset') => {
    setSimulating(mode);
    try {
      const res = await simulateTelemetryMode(mode);
      if (res && res.telemetryZones) {
        setZones(res.telemetryZones);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setTimeout(() => setSimulating(null), 800);
    }
  };

  const handleCheckIn = () => {
    setCheckInNotice(`Spot reserved at ${selectedZone.name}! IoT desk beacon activated.`);
    setTimeout(() => setCheckInNotice(null), 4000);
  };

  // Helper for thermal heat color
  const getHeatStyle = (heat: string) => {
    switch (heat) {
      case 'low':
        return { color: '#16a34a', bg: 'rgba(240, 253, 244, 0.9)', border: '#86efac', text: 'Low Crowd' };
      case 'moderate':
        return { color: '#d97706', bg: 'rgba(254, 243, 199, 0.9)', border: '#fcd34d', text: 'Moderate' };
      case 'high':
        return { color: '#ea580c', bg: 'rgba(255, 237, 213, 0.9)', border: '#fdba74', text: 'Busy' };
      case 'critical':
      default:
        return { color: '#dc2626', bg: 'rgba(254, 226, 226, 0.9)', border: '#fca5a5', text: 'Peak Crowd' };
    }
  };

  // Helper for noise meter color
  const getNoiseStyle = (category: string, db: number) => {
    if (db <= 35) return { color: '#15803d', label: 'Whisper Quiet', icon: '🟢', bg: '#dcfce7' };
    if (db <= 48) return { color: '#0369a1', label: 'Calm Study', icon: '🔵', bg: '#e0f2fe' };
    if (db <= 62) return { color: '#b45309', label: 'Moderate Talk', icon: '🟡', bg: '#fef3c7' };
    return { color: '#b91c1c', label: 'Lively Buzz', icon: '🔴', bg: '#fee2e2' };
  };

  const selectedNoise = getNoiseStyle(selectedZone.noiseCategory, selectedZone.decibelLevel);
  const selectedHeat = getHeatStyle(selectedZone.crowdHeat);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Telemetry KPIs */}
      <Glass
        style={{
          padding: '24px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.4rem' }}>🗺️</span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                Campus Digital Twin & Acoustic Telemetry
              </h2>
              <span
                style={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                Live IoT Sensors
              </span>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              Real-time ambient decibel tracking, thermal crowd density, power availability, and AI spot pathfinding across campus facilities.
            </p>
          </div>

          {/* Judge Simulation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(241, 245, 249, 0.8)',
              padding: '6px 12px',
              borderRadius: '14px',
              border: '1px solid #cbd5e1'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ Pitch Controls:
            </span>
            <button
              onClick={() => handleSimulation('quiet')}
              disabled={simulating !== null}
              title="Simulate serene late night library environment"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: '#dcfce7',
                color: '#166534',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              🌙 Late Night
            </button>
            <button
              onClick={() => handleSimulation('rush')}
              disabled={simulating !== null}
              title="Simulate peak finals rush hour with high noise"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: '#fee2e2',
                color: '#991b1b',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              ⚡ Finals Rush
            </button>
            <button
              onClick={() => handleSimulation('reset')}
              disabled={simulating !== null}
              title="Reset sensors to balanced daytime telemetry"
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: 'none',
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}
        >
          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>CAMPUS NOISE AVERAGE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: avgDecibels < 45 ? '#16a34a' : '#ea580c' }}>
                {avgDecibels}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>dB Sound Level</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px', fontWeight: 500 }}>
              ● 6 acoustic IoT probes online
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>CAMPUS CROWD DENSITY</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>
                {Math.round((totalOccupancy / (totalCapacity || 1)) * 100)}%
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                ({totalOccupancy}/{totalCapacity} Seats)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              {totalCapacity - totalOccupancy} open desks across campus
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>FREE AC POWER OUTLETS</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d9488' }}>
                {totalOutlets}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Outlets</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0d9488', marginTop: '2px', fontWeight: 500 }}>
              ⚡ High-speed laptop charging
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>CAMPUS WI-FI 6 MESH</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed' }}>
                530
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Mbps Avg</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#7c3aed', marginTop: '2px', fontWeight: 500 }}>
              📶 3ms ultra-low latency
            </div>
          </div>
        </div>
      </Glass>

      {/* AI Smart Spot Pathfinder Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(124, 58, 237, 0.08))',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(147, 197, 253, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.1rem'
            }}
          >
            🎯
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              AI Smart Spot Pathfinder
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Select your study intent to instantly pinpoint the optimal campus location
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => runSmartPathfinder('focus')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activePreset === 'focus' ? '#2563eb' : '#ffffff',
              color: activePreset === 'focus' ? '#ffffff' : '#1e293b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🤫 Deep Focus (&lt;35 dB)
          </button>
          <button
            onClick={() => runSmartPathfinder('power')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activePreset === 'power' ? '#2563eb' : '#ffffff',
              color: activePreset === 'power' ? '#ffffff' : '#1e293b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⚡ Power User (Outlets & Wi-Fi)
          </button>
          <button
            onClick={() => runSmartPathfinder('collab')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activePreset === 'collab' ? '#2563eb' : '#ffffff',
              color: activePreset === 'collab' ? '#ffffff' : '#1e293b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            👥 Team Sprint (Whiteboards)
          </button>
          <button
            onClick={() => runSmartPathfinder('social')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activePreset === 'social' ? '#2563eb' : '#ffffff',
              color: activePreset === 'social' ? '#ffffff' : '#1e293b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ☕ Social / Cafe
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Zones Floorplan + Zone Deep Inspector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(300px, 1.2fr)',
          gap: '24px'
        }}
      >
        {/* Left: Floorplan Zone Cards */}
        <div>
          {/* Zone Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              Campus Facility Zones ({filteredZones.length})
            </h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'silent', label: 'Silent' },
                { id: 'collaborative', label: 'Group' },
                { id: 'lab', label: 'Labs' },
                { id: 'social', label: 'Social' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterType === f.id ? '#2563eb' : 'rgba(255, 255, 255, 0.8)',
                    color: filterType === f.id ? '#ffffff' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}
          >
            {filteredZones.map(zone => {
              const isSelected = zone.id === selectedZoneId;
              const heat = getHeatStyle(zone.crowdHeat);
              const noise = getNoiseStyle(zone.noiseCategory, zone.decibelLevel);
              const occPercent = Math.round((zone.currentOccupancy / zone.capacity) * 100);

              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setActivePreset(null);
                  }}
                  style={{
                    background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    boxShadow: isSelected
                      ? '0 8px 24px rgba(37, 99, 235, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                        {zone.building} • {zone.floor}
                      </span>
                      <h4 style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        {zone.name}
                      </h4>
                    </div>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: heat.bg,
                        color: heat.color,
                        border: `1px solid ${heat.border}`
                      }}
                    >
                      {heat.text}
                    </span>
                  </div>

                  {/* Decibel Audio Meter */}
                  <div
                    style={{
                      background: noise.bg,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      margin: '10px 0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem' }}>🔊</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: noise.color }}>
                        {zone.decibelLevel} dB
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: noise.color }}>
                        • {noise.label}
                      </span>
                    </div>

                    {/* Animated Audio Equalizer Bars */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
                      {[40, 80, 60, 100, 50].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '3px',
                            height: `${Math.max(4, Math.min(18, (zone.decibelLevel / 90) * h))}px`,
                            backgroundColor: noise.color,
                            borderRadius: '2px',
                            animation: `soundWave ${0.6 + i * 0.15}s ease-in-out infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                      <span>Occupancy</span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>
                        {zone.currentOccupancy} / {zone.capacity} seats ({occPercent}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${occPercent}%`,
                          background: occPercent > 80 ? '#ef4444' : occPercent > 50 ? '#f59e0b' : '#10b981',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Utilities */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                      paddingTop: '8px',
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '0.75rem',
                      color: '#475569'
                    }}
                  >
                    <span>⚡ {zone.powerOutletsAvailable} outlets free</span>
                    <span>📶 {zone.wifiSpeedMbps} Mbps</span>
                    {isSelected && (
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>● Selected</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deep Zone Inspector & Spot Pathfinder Target */}
        <div>
          <Glass
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              position: 'sticky',
              top: '24px'
            }}
          >
            {checkInNotice && (
              <div
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  color: '#15803d',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ✅ {checkInNotice}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#2563eb',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}
              >
                Zone Telemetry Inspector
              </span>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: selectedHeat.bg,
                  color: selectedHeat.color,
                  border: `1px solid ${selectedHeat.border}`
                }}
              >
                {selectedHeat.text}
              </span>
            </div>

            <h3 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {selectedZone.name}
            </h3>
            <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '0.88rem' }}>
              📍 {selectedZone.building} • {selectedZone.floor}
            </p>

            {/* Big Decibel Acoustic Meter */}
            <div
              style={{
                background: selectedNoise.bg,
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '16px',
                border: `1px solid ${selectedNoise.color}30`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: selectedNoise.color, textTransform: 'uppercase' }}>
                  Acoustic Decibel Meter
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: selectedNoise.color }}>
                  {selectedNoise.icon} {selectedNoise.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '10px 0 8px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: selectedNoise.color }}>
                  {selectedZone.decibelLevel}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: selectedNoise.color }}>
                  dB SPL
                </span>
              </div>

              {/* Dynamic Sound Waveform Canvas Animation */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '32px', marginTop: '8px' }}>
                {[20, 45, 75, 35, 90, 60, 85, 40, 70, 95, 50, 80, 30].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${Math.max(6, Math.min(32, (selectedZone.decibelLevel / 85) * (h * 0.35)))}px`,
                      background: selectedNoise.color,
                      borderRadius: '3px',
                      opacity: 0.85,
                      animation: `soundWave ${0.5 + (i % 5) * 0.15}s ease-in-out infinite alternate`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Hardware & Utility Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '16px'
              }}
            >
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AC OUTLETS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  ⚡ {selectedZone.powerOutletsAvailable} Free
                </div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '2px', fontWeight: 600 }}>
                  {selectedZone.powerStatus.toUpperCase()} SUPPLY
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>WI-FI 6 THROUGHPUT</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  📶 {selectedZone.wifiSpeedMbps} Mbps
                </div>
                <div style={{ fontSize: '0.72rem', color: '#2563eb', marginTop: '2px', fontWeight: 600 }}>
                  {selectedZone.wifiLatencyMs}ms ping
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SEAT AVAILABILITY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  🪑 {selectedZone.capacity - selectedZone.currentOccupancy} Open
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  Out of {selectedZone.capacity} total
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>AIR QUALITY (AQI)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  🍃 AQI {selectedZone.airQualityAqi}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '2px', fontWeight: 600 }}>
                  FRESH & FILTERED
                </div>
              </div>
            </div>

            {/* Zone Amenities */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                AVAILABLE AMENITIES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedZone.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(241, 245, 249, 0.9)',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155'
                    }}
                  >
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Check-In / Pathfinder Action Button */}
            <button
              onClick={handleCheckIn}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              📍 Reserve Spot & Activate Desk Beacon
            </button>
          </Glass>
        </div>
      </div>
    </div>
  );
};
