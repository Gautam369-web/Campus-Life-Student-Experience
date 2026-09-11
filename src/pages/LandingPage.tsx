import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ProjectOverviewModal } from '../components/ProjectOverviewModal';

// -------------------------------------------------------------
// 3D Models for Feature Pods
// -------------------------------------------------------------

// 1. Study Spaces 3D Model: Desk, glowing lamp, holographic chair
const StudySpacesModel: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  const lampGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (lampGlowRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
      lampGlowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Desk top */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.0]} />
        <meshStandardMaterial color="#0f766e" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Desk legs */}
      {([
        [-0.7, 0.18, -0.4],
        [0.7, 0.18, -0.4],
        [-0.7, 0.18, 0.4],
        [0.7, 0.18, 0.4]
      ] as [number, number, number][]).map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Laptop */}
      <mesh position={[0, 0.46, -0.05]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.55, 0.02, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, -0.24]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.55, 0.35, 0.02]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>

      {/* Desk Lamp */}
      <mesh position={[-0.55, 0.65, -0.25]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh ref={lampGlowRef} position={[-0.45, 0.9, -0.2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={hovered ? 2.2 : 1.2}
        />
      </mesh>
      <pointLight position={[-0.45, 0.9, -0.2]} intensity={hovered ? 2.5 : 1.2} distance={3} color="#34d399" />

      {/* Floating Status Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.28, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={hovered ? 0.9 : 0.4} />
      </mesh>
    </group>
  );
};

// 2. Lost & Found 3D Model: High-tech holographic scanner and floating cube
const LostFoundModel: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRingRef.current) outerRingRef.current.rotation.z = t * 0.8;
    if (innerRingRef.current) innerRingRef.current.rotation.x = -t * 1.1;
    if (cubeRef.current) {
      cubeRef.current.rotation.y = t * 0.5;
      cubeRef.current.position.y = 0.75 + Math.sin(t * 2) * 0.08;
    }
  });

  return (
    <group>
      {/* Base scanner pedestal */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.04, 32]} />
        <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.6} />
      </mesh>

      {/* Outer Rotating Hologram Ring */}
      <mesh ref={outerRingRef} position={[0, 0.75, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.85, 0.03, 16, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={hovered ? 2.0 : 1.0}
        />
      </mesh>

      {/* Inner Rotating Ring */}
      <mesh ref={innerRingRef} position={[0, 0.75, 0]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.65, 0.025, 16, 32]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={1.2} />
      </mesh>

      {/* Floating Center Mystery Box */}
      <mesh ref={cubeRef} position={[0, 0.75, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#1e40af"
          emissiveIntensity={hovered ? 1.5 : 0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      <pointLight position={[0, 0.8, 0]} intensity={hovered ? 2.5 : 1.2} distance={3} color="#60a5fa" />

      {/* Base Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.28, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={hovered ? 0.9 : 0.4} />
      </mesh>
    </group>
  );
};

// 3. Campus Events 3D Model: Floating Calendar Hologram & Stage
const CampusEventsModel: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  const cardRef = useRef<THREE.Group>(null);
  const badgeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cardRef.current) {
      cardRef.current.position.y = 0.7 + Math.sin(t * 1.8) * 0.06;
      cardRef.current.rotation.y = Math.sin(t * 0.6) * 0.15;
    }
    if (badgeRef.current) {
      const s = 1 + Math.sin(t * 4) * 0.12;
      badgeRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Circular stage */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.0, 1.15, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.03, 32]} />
        <meshStandardMaterial color="#d97706" emissive="#b45309" emissiveIntensity={0.5} />
      </mesh>

      {/* Floating 3D Calendar Plate */}
      <group ref={cardRef} position={[0, 0.7, 0]}>
        {/* Back plate */}
        <mesh>
          <boxGeometry args={[0.85, 1.05, 0.08]} />
          <meshStandardMaterial color="#fffbeb" metalness={0.2} roughness={0.4} />
        </mesh>
        {/* Top header bar */}
        <mesh position={[0, 0.4, 0.045]}>
          <boxGeometry args={[0.85, 0.24, 0.02]} />
          <meshStandardMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.5} />
        </mesh>
        {/* Calendar grid lines */}
        {[-0.1, 0.08, 0.26].map((x, i) =>
          [-0.15, -0.02, 0.12].map((y, j) => (
            <mesh key={`${i}-${j}`} position={[x, y, 0.045]}>
              <boxGeometry args={[0.12, 0.09, 0.01]} />
              <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.3} />
            </mesh>
          ))
        )}
        {/* Notification indicator badge */}
        <mesh ref={badgeRef} position={[0.38, 0.5, 0.06]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.5} />
        </mesh>
      </group>

      <pointLight position={[0, 0.9, 0.3]} intensity={hovered ? 2.5 : 1.2} distance={3} color="#f59e0b" />

      {/* Base Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.28, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={hovered ? 0.9 : 0.4} />
      </mesh>
    </group>
  );
};

// 4. AI Campus Assistant 3D Model: Floating robot with pulsing visor and antennas
const AIAssistantModel: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  const botGroupRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (botGroupRef.current) {
      botGroupRef.current.position.y = 0.8 + Math.sin(t * 2) * 0.09;
      botGroupRef.current.rotation.y = Math.sin(t * 0.7) * 0.25;
    }
    if (visorRef.current) {
      const pulse = 1.2 + Math.sin(t * 4) * 0.4;
      (visorRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = hovered
        ? pulse * 1.5
        : pulse;
    }
  });

  return (
    <group>
      {/* Base tech pad */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.03, 32]} />
        <meshStandardMaterial color="#7c3aed" emissive="#6d28d9" emissiveIntensity={0.6} />
      </mesh>

      {/* Floating Robot Body */}
      <group ref={botGroupRef} position={[0, 0.8, 0]}>
        {/* Head / Torso Egg */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.15} />
        </mesh>

        {/* Visor Screen */}
        <mesh ref={visorRef} position={[0, 0.06, 0.32]}>
          <boxGeometry args={[0.45, 0.16, 0.14]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>

        {/* Antenna stalk */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Antenna glowing orb */}
        <mesh position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#a855f7"
            emissiveIntensity={hovered ? 2.5 : 1.4}
          />
        </mesh>

        {/* Floating Ear Pods */}
        <mesh position={[-0.45, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.45, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      <pointLight position={[0, 0.9, 0.4]} intensity={hovered ? 2.8 : 1.4} distance={3.5} color="#c084fc" />

      {/* Base Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.28, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={hovered ? 0.9 : 0.4} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Interactive Feature Pod Wrapper with 3D-Anchored <Html> Card
// -------------------------------------------------------------
interface FeaturePodProps {
  id: 'spaces' | 'lost' | 'events' | 'chat';
  title: string;
  badge: string;
  badgeColor: string;
  glowColor: string;
  desc: string;
  actionText: string;
  position: [number, number, number];
  children: (hovered: boolean) => React.ReactNode;
  onSelect: (tab: 'spaces' | 'lost' | 'events' | 'chat') => void;
}

const FeaturePod: React.FC<FeaturePodProps> = ({
  id,
  title,
  badge,
  badgeColor,
  glowColor,
  desc,
  actionText,
  position,
  children,
  onSelect
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Smooth scale up on hover
      const targetScale = hovered ? 1.08 : 1.0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* 3D Model Render */}
      {children(hovered)}

      {/* Floating 3D-Anchored UI Card */}
      <Html
        position={[0, 2.2, 0]}
        center
        distanceFactor={11}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div
          onClick={() => onSelect(id)}
          style={{
            width: '230px',
            padding: '14px 16px',
            borderRadius: '16px',
            background: hovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1.5px solid ${hovered ? glowColor : 'rgba(203, 213, 225, 0.8)'}`,
            boxShadow: hovered
              ? `0 14px 35px -6px rgba(0, 0, 0, 0.12), 0 0 20px ${glowColor}33`
              : '0 8px 24px -4px rgba(0, 0, 0, 0.06)',
            transform: hovered ? 'translateY(-4px) scale(1.04)' : 'translateY(0) scale(1)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '12px',
                background: badgeColor,
                color: '#ffffff',
                letterSpacing: '0.3px',
                textTransform: 'uppercase'
              }}
            >
              {badge}
            </span>
            <span style={{ fontSize: '0.85rem', opacity: hovered ? 1 : 0.6 }}>✨</span>
          </div>

          <h3
            style={{
              margin: '0 0 4px 0',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0f172a',
              fontFamily: 'var(--font-heading, Plus Jakarta Sans, sans-serif)'
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: '0 0 10px 0',
              fontSize: '0.78rem',
              lineHeight: '1.35',
              color: '#475569'
            }}
          >
            {desc}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: glowColor,
              transition: 'gap 0.2s ease'
            }}
          >
            <span>{actionText}</span>
            <span style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s ease' }}>
              →
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};

// -------------------------------------------------------------
// Dynamic Orbiting Lights & Central Campus Nexus in 3D Scene
// -------------------------------------------------------------
const SceneEnvironment: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime() * 0.5;
      lightRef.current.position.x = Math.sin(t) * 8;
      lightRef.current.position.z = Math.cos(t) * 8;
      lightRef.current.position.y = 4 + Math.sin(t * 2) * 1.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 15, 8]} intensity={1.5} />
      <directionalLight position={[-10, 8, -6]} intensity={0.6} color="#cbd5e1" />
      <pointLight ref={lightRef} intensity={1.5} distance={20} color="#38bdf8" decay={2} />
    </>
  );
};

// -------------------------------------------------------------
// Central Campus Nexus: Rotating 3D Diamond with 3D-Anchored Card
// -------------------------------------------------------------
interface CentralDiamondNexusProps {
  onSelectTab: (tab: 'spaces' | 'lost' | 'events' | 'chat') => void;
  onEnterDashboard: () => void;
}

const CentralDiamondNexus: React.FC<CentralDiamondNexusProps> = ({ onSelectTab, onEnterDashboard }) => {
  const diamondRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diamondRef.current) {
      diamondRef.current.rotation.y = t * 0.7;
      diamondRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
      diamondRef.current.position.y = 0.95 + Math.sin(t * 1.8) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.5;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.7) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Campus Nexus Core Platform */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[4.8, 5.0, 0.1, 48]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Concentric rings */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 4.25, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.54, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.35} />
      </mesh>

      {/* Orbiting Hologram Ring around Diamond */}
      <mesh ref={ringRef} position={[0, 0.95, 0]}>
        <torusGeometry args={[0.9, 0.022, 16, 48]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 2.5 : 1.4}
        />
      </mesh>

      {/* 3D Glowing Diamond Crystal */}
      <mesh
        ref={diamondRef}
        position={[0, 0.95, 0]}
        scale={hovered ? 1.15 : 1.0}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onEnterDashboard();
        }}
      >
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0ea5e9"
          emissiveIntensity={hovered ? 2.5 : 1.6}
          metalness={0.4}
          roughness={0.15}
        />
      </mesh>
      <pointLight position={[0, 1.0, 0]} intensity={hovered ? 3.0 : 1.8} distance={7} color="#38bdf8" />

      {/* 3D-Anchored Hero Card Moving with the Central Diamond */}
      <Html
        position={[0, 2.8, 0]}
        center
        distanceFactor={11}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            width: '320px',
            padding: '16px 18px',
            borderRadius: '22px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(2, 132, 199, 0.4)',
            boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.08), 0 0 30px rgba(56, 189, 248, 0.2)',
            textAlign: 'center',
            transition: 'all 0.25s ease'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '16px',
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              color: '#0284c7',
              fontSize: '0.72rem',
              fontWeight: 700,
              marginBottom: '8px',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}
          >
            <span>💎</span> Central Campus Nexus
          </div>

          <h2
            style={{
              margin: '0 0 6px 0',
              fontSize: '1.18rem',
              fontWeight: 800,
              letterSpacing: '-0.4px',
              lineHeight: 1.25,
              color: '#0f172a',
              fontFamily: 'var(--font-heading, Plus Jakarta Sans, sans-serif)'
            }}
          >
            Navigate Campus Life in 3D
          </h2>

          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '0.76rem',
              color: '#475569',
              lineHeight: 1.45
            }}
          >
            Click any feature pod to explore real-time study rooms, lost & found logs, live campus events, and AI assistant.
          </p>

          {/* Quick Navigation Chips */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              marginBottom: '12px'
            }}
          >
            <button
              onClick={() => onSelectTab('spaces')}
              style={{
                background: 'rgba(220, 252, 231, 0.9)',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '5px 8px',
                color: '#15803d',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(220, 252, 231, 0.9)')}
            >
              🏢 9 Desks Open
            </button>
            <button
              onClick={() => onSelectTab('lost')}
              style={{
                background: 'rgba(219, 234, 254, 0.9)',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                padding: '5px 8px',
                color: '#1d4ed8',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(219, 234, 254, 0.9)')}
            >
              🔍 14 Items Logged
            </button>
            <button
              onClick={() => onSelectTab('events')}
              style={{
                background: 'rgba(254, 243, 199, 0.9)',
                border: '1px solid #fde68a',
                borderRadius: '10px',
                padding: '5px 8px',
                color: '#b45309',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fef3c7')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(254, 243, 199, 0.9)')}
            >
              📅 5 Events Today
            </button>
            <button
              onClick={() => onSelectTab('chat')}
              style={{
                background: 'rgba(243, 232, 255, 0.9)',
                border: '1px solid #e9d5ff',
                borderRadius: '10px',
                padding: '5px 8px',
                color: '#7e22ce',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3e8ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(243, 232, 255, 0.9)')}
            >
              🤖 AI Assistant
            </button>
          </div>

          <button
            onClick={onEnterDashboard}
            style={{
              width: '100%',
              padding: '7px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Launch All-in-One Dashboard →
          </button>
        </div>
      </Html>
    </group>
  );
};

// -------------------------------------------------------------
// Main LandingPage Component
// -------------------------------------------------------------
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  const handleSelectTab = (tab: 'spaces' | 'lost' | 'events' | 'chat') => {
    navigate(`/dashboard?tab=${tab}`);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #f8fafc 100%)',
        fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
        color: '#1e293b'
      }}
    >
      {/* 1. Top Glass Navigation Bar */}
      <header
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: '1200px',
          zIndex: 30,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '20px',
          border: '1px solid rgba(203, 213, 225, 0.6)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            🎓
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.3px', color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
              Campus Companion
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Student Life Platform</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#15803d',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
            className="header-live-badge"
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'liveBeacon 2s infinite' }}></span>
            Campus Online
          </div>

          <button
            onClick={() => setIsOverviewOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#334155';
            }}
          >
            📋 Project Overview
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.25)';
            }}
          >
            Launch Dashboard →
          </button>
        </div>
      </header>

      {/* 2. The 3D Canvas Scene */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10
        }}
        camera={{
          position: [0, 7.2, 10.8],
          fov: 45
        }}
      >
        <SceneEnvironment />

        {/* Central Campus Nexus: 3D Diamond Crystal + 3D Hero Card in Middle */}
        <CentralDiamondNexus
          onSelectTab={handleSelectTab}
          onEnterDashboard={() => navigate('/dashboard')}
        />

        {/* 4 Interactive Feature Pods */}
        <FeaturePod
          id="spaces"
          title="Study Spaces"
          badge="Live Availability"
          badgeColor="#059669"
          glowColor="#10b981"
          desc="Find available study rooms, quiet zones & desk slots in real-time."
          actionText="Find Study Desk"
          position={[-3.6, 0, -2.8]}
          onSelect={handleSelectTab}
        >
          {(hovered) => <StudySpacesModel hovered={hovered} />}
        </FeaturePod>

        <FeaturePod
          id="lost"
          title="Lost & Found"
          badge="Active Hub"
          badgeColor="#2563eb"
          glowColor="#3b82f6"
          desc="Report lost items, browse found property & instant claim matching."
          actionText="Search Belongings"
          position={[3.6, 0, -2.8]}
          onSelect={handleSelectTab}
        >
          {(hovered) => <LostFoundModel hovered={hovered} />}
        </FeaturePod>

        <FeaturePod
          id="events"
          title="Campus Events"
          badge="Upcoming Pulse"
          badgeColor="#d97706"
          glowColor="#f59e0b"
          desc="Hackathons, club mixers, workshops & cultural fest notifications."
          actionText="Explore Calendar"
          position={[3.6, 0, 2.8]}
          onSelect={handleSelectTab}
        >
          {(hovered) => <CampusEventsModel hovered={hovered} />}
        </FeaturePod>

        <FeaturePod
          id="chat"
          title="AI Assistant"
          badge="24/7 Smart Bot"
          badgeColor="#7c3aed"
          glowColor="#8b5cf6"
          desc="Ask questions about campus map, exam schedules, and services."
          actionText="Ask Assistant"
          position={[-3.6, 0, 2.8]}
          onSelect={handleSelectTab}
        >
          {(hovered) => <AIAssistantModel hovered={hovered} />}
        </FeaturePod>

        {/* Smooth OrbitControls for interactive rotating & inspecting */}
        <OrbitControls
          enableZoom={true}
          minDistance={6.5}
          maxDistance={14.0}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 2.15}
          minPolarAngle={Math.PI / 8}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* 3. Bottom Control Bar & Quick Shortcuts */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          width: '92%',
          maxWidth: '780px'
        }}
      >
        {/* Quick Nav Shortcut Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '6px 10px',
            borderRadius: '24px',
            border: '1px solid rgba(203, 213, 225, 0.6)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          {[
            { id: 'spaces', icon: '🏢', label: 'Study Spaces', color: '#10b981' },
            { id: 'lost', icon: '🔍', label: 'Lost & Found', color: '#3b82f6' },
            { id: 'events', icon: '📅', label: 'Events Feed', color: '#f59e0b' },
            { id: 'chat', icon: '🤖', label: 'AI Assistant', color: '#8b5cf6' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id as any)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#334155',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Interaction Hint */}
        <div
          style={{
            fontSize: '0.78rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center'
          }}
        >
          <span>🖱️ Click any 3D pod to jump in</span>
          <span>•</span>
          <span>Drag to orbit campus galaxy</span>
          <span>•</span>
          <span>Scroll to zoom</span>
        </div>
      </div>

      {/* In-App Project Overview Modal */}
      <ProjectOverviewModal isOpen={isOverviewOpen} onClose={() => setIsOverviewOpen(false)} />
    </div>
  );
};