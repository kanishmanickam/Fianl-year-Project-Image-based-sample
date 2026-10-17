import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { Lamp, Computer } from '../shared/CampusProps';

// Server rack
const ServerRack: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 1.0, 0]}>
      <boxGeometry args={[0.6, 2.0, 0.5]} />
      <meshStandardMaterial color="#0f172a" roughness={0.5} />
    </mesh>
    {[0.1, 0.4, 0.7, 1.0, 1.3, 1.6, 1.9].map((y, i) => (
      <mesh key={i} position={[0, y, 0.26]}>
        <boxGeometry args={[0.52, 0.12, 0.02]} />
        <meshStandardMaterial
          color={i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#22c55e' : '#f59e0b'}
          emissive={i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#22c55e' : '#f59e0b'}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
    ))}
  </group>
);

// Large display screen
const LargeScreen: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position, rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh castShadow position={[0, 1.5, 0]}>
      <boxGeometry args={[4.5, 2.6, 0.1]} />
      <meshStandardMaterial color="#0f172a" roughness={0.3} />
    </mesh>
    <mesh position={[0, 1.5, 0.056]}>
      <boxGeometry args={[4.2, 2.3, 0.01]} />
      <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.25} roughness={0.1} />
    </mesh>
    {/* Scan-line effect strips */}
    {[0.3, 0.8, 1.3, 1.8, 2.3].map((y, i) => (
      <mesh key={i} position={[0, y, 0.062]}>
        <boxGeometry args={[4.0, 0.03, 0.005]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={0.6} />
      </mesh>
    ))}
    {/* Mount */}
    <mesh position={[0, 0.15, 0.1]}>
      <boxGeometry args={[0.35, 0.3, 0.2]} />
      <meshStandardMaterial color="#334155" roughness={0.5} />
    </mesh>
  </group>
);

export const CyberLabBuilding: React.FC = () => (
  <group position={[30, 0, 5]}>
    {/* ── Exterior (Hollow Walls) ────────────────────────────────────────── */}
    {/* Left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-8, 4.5, 0]}>
        <boxGeometry args={[0.2, 9, 14]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.7} />
      </mesh>
    </RigidBody>
    {/* Right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[8, 4.5, 0]}>
        <boxGeometry args={[0.2, 9, 14]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.7} />
      </mesh>
    </RigidBody>
    {/* Back Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 4.5, 7]}>
        <boxGeometry args={[16, 9, 0.2]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.7} />
      </mesh>
    </RigidBody>
    {/* Front-left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-4.7, 4.5, -7]}>
        <boxGeometry args={[6.6, 9, 0.2]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.7} />
      </mesh>
    </RigidBody>
    {/* Front-right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[4.7, 4.5, -7]}>
        <boxGeometry args={[6.6, 9, 0.2]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.7} />
      </mesh>
    </RigidBody>
    {/* Lintel above center door (leaving door height 2.6 clear) */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[0, 5.8, -7]}>
        <boxGeometry args={[2.8, 6.4, 0.2]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.7} />
      </mesh>
    </RigidBody>

    {/* Glowing torus ring at top */}
    <mesh position={[0, 9.2, 0]}>
      <torusGeometry args={[6.5, 0.18, 8, 32]} />
      <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} roughness={0.2} />
    </mesh>

    {/* Corner neon strips */}
    {([-8, 8] as const).map((x) => (
      <mesh key={x} position={[x, 4.5, 0]}>
        <boxGeometry args={[0.12, 9, 0.12]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.0} />
      </mesh>
    ))}

    {/* Glass windows (split, leaving center door opening clear) */}
    <group position={[0, 0, -7.05]}>
      <mesh position={[-2.7, 4, 0]}>
        <boxGeometry args={[2.6, 7, 0.1]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.35} roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh position={[2.7, 4, 0]}>
        <boxGeometry args={[2.6, 7, 0.1]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.35} roughness={0.05} metalness={0.9} />
      </mesh>
    </group>

    {/* ── Futuristic Cyber Open Sliding Doors ──────────────────────────── */}
    <group position={[0, 0, -7.0]}>
      {/* Sleek Metal Door Frame */}
      <mesh position={[-1.4, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.4, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.56, 0]}>
        <boxGeometry args={[2.8, 0.08, 0.18]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Slid-open Left Glass Panel */}
      <group position={[-1.25, 1.3, 0.02]}>
        <mesh>
          <boxGeometry args={[1.2, 2.4, 0.04]} />
          <meshStandardMaterial color="#00f0ff" transparent opacity={0.3} metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Cyan Neon Edge */}
        <mesh position={[0.59, 0, 0]}>
          <boxGeometry args={[0.02, 2.4, 0.05]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Slid-open Right Glass Panel */}
      <group position={[1.25, 1.3, 0.02]}>
        <mesh>
          <boxGeometry args={[1.2, 2.4, 0.04]} />
          <meshStandardMaterial color="#00f0ff" transparent opacity={0.3} metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Cyan Neon Edge */}
        <mesh position={[-0.59, 0, 0]}>
          <boxGeometry args={[0.02, 2.4, 0.05]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>

    {/* Sign */}
    <group position={[0, 8.2, -7.12]}>
      <mesh>
        <boxGeometry args={[8, 0.6, 0.1]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.4} roughness={0.2} />
      </mesh>
      <Html distanceFactor={15} position={[0, 0, -0.08]} center>
        <div className="bg-slate-950/95 border-2 border-cyan-500/80 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.45)] text-center select-none pointer-events-none min-w-[140px] font-sans">
          <div className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">Cyber Lab</div>
          <div className="text-cyan-400 text-[8px] font-bold tracking-wider mt-0.5 uppercase whitespace-nowrap">Security Division</div>
        </div>
      </Html>
    </group>

    {/* ── Interior ──────────────────────────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
      <planeGeometry args={[15, 13]} />
      <meshStandardMaterial color="#020617" roughness={0.3} />
    </mesh>

    {/* Server racks along back wall */}
    {[-5, -3, -1, 1, 3, 5].map((x, i) => (
      <ServerRack key={i} position={[x, 0, -5.5]} />
    ))}

    {/* Large display screen */}
    <LargeScreen position={[0, 0, -4.5]} rotationY={Math.PI} />

    {/* Computer workstations in rows */}
    {[-4, -2, 0, 2, 4].map((x, i) => (
      <Computer key={i} position={[x, 0, -1.5]} rotationY={Math.PI} screenColor="#00f0ff" />
    ))}
    {[-4, -2, 0, 2, 4].map((x, i) => (
      <Computer key={`b${i}`} position={[x, 0, 1.5]} screenColor="#00f0ff" />
    ))}

    {/* Meeting table */}
    <group position={[0, 0, 4]}>
      <mesh castShadow position={[0, 0.76, 0]}>
        <boxGeometry args={[4.5, 0.08, 1.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Neon edge */}
      <mesh position={[0, 0.77, 0]}>
        <boxGeometry args={[4.52, 0.04, 1.62]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
      </mesh>
      {/* Table legs */}
      {([[-2, 0.6], [2, 0.6], [-2, -0.6], [2, -0.6]] as [number, number][]).map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.37, lz]}>
          <boxGeometry args={[0.07, 0.74, 0.07]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      ))}
    </group>

    {/* ── Exterior ──────────────────────────────────────────────────── */}
    <Lamp position={[-7, 0, -8]} />
    <Lamp position={[7, 0, -8]} />
  </group>
);

export default CyberLabBuilding;
