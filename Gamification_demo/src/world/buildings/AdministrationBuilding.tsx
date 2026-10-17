import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { Bench, Lamp, Tree, Computer } from '../shared/CampusProps';

export const AdministrationBuilding: React.FC = () => (
  <group position={[0, 0, -30]}>
    {/* ── Exterior Shell (Hollow Walls) ────────────────────────────────── */}
    {/* Left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-11, 5, 0]}>
        <boxGeometry args={[0.2, 10, 14]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[11, 5, 0]}>
        <boxGeometry args={[0.2, 10, 14]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Back Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 5, -7]}>
        <boxGeometry args={[22, 10, 0.2]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Front-left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-6.5, 5, 7]}>
        <boxGeometry args={[9, 10, 0.2]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Front-right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[6.5, 5, 7]}>
        <boxGeometry args={[9, 10, 0.2]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Lintel above center door (leaving door height 2.6 clear) */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[0, 6.3, 7]}>
        <boxGeometry args={[4.0, 7.4, 0.2]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
    </RigidBody>

    {/* Glass windows (split, leaving center door opening clear) */}
    <group position={[0, 0, 7.05]}>
      <mesh position={[-5.0, 5, 0]}>
        <boxGeometry args={[6.0, 8.0, 0.12]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.35} roughness={0.05} metalness={0.7} />
      </mesh>
      <mesh position={[5.0, 5, 0]}>
        <boxGeometry args={[6.0, 8.0, 0.12]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.35} roughness={0.05} metalness={0.7} />
      </mesh>
    </group>

    {/* ── Grand Administration Open Double Doors ──────────────────────── */}
    <group position={[0, 0, 7.0]}>
      {/* Grand White Door Frame */}
      <mesh position={[-2.02, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.2]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.5} />
      </mesh>
      <mesh position={[2.02, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.2]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.56, 0]}>
        <boxGeometry args={[4.04, 0.08, 0.2]} />
        <meshStandardMaterial color="#faf9f6" roughness={0.5} />
      </mesh>

      {/* Swung Open Left Door (swung inward) */}
      <group position={[-1.95, 1.3, 0]} rotation={[0, Math.PI / 2.4, 0]}>
        <mesh position={[0.95, 0, 0.04]}>
          <boxGeometry args={[1.9, 2.4, 0.08]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.5} />
        </mesh>
        {/* Gold panel inlay */}
        <mesh position={[0.95, 0, 0.082]}>
          <boxGeometry args={[1.4, 1.8, 0.01]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Gold handle */}
        <mesh position={[1.7, 0, 0.12]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Swung Open Right Door (swung inward) */}
      <group position={[1.95, 1.3, 0]} rotation={[0, -Math.PI / 2.4, 0]}>
        <mesh position={[-0.95, 0, 0.04]}>
          <boxGeometry args={[1.9, 2.4, 0.08]} />
          <meshStandardMaterial color="#faf9f6" roughness={0.5} />
        </mesh>
        {/* Gold panel inlay */}
        <mesh position={[-0.95, 0, 0.082]}>
          <boxGeometry args={[1.4, 1.8, 0.01]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Gold handle */}
        <mesh position={[-1.7, 0, 0.12]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>

    {/* Roof cornice */}
    <mesh castShadow position={[0, 10.3, 0]}>
      <boxGeometry args={[23, 0.6, 15]} />
      <meshStandardMaterial color="#d4c5a9" roughness={0.85} />
    </mesh>

    {/* Name plate */}
    <mesh position={[0, 8.2, 7.12]}>
      <boxGeometry args={[8, 0.8, 0.08]} />
      <meshStandardMaterial color="#1e3a5f" roughness={0.4} />
    </mesh>
    <group position={[0, 8.2, 7.17]}>
      <mesh>
        <boxGeometry args={[7.6, 0.5, 0.02]} />
        <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
      <Html distanceFactor={15} position={[0, 0, 0.06]} center>
        <div className="bg-slate-950/95 border-2 border-blue-500/80 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.45)] text-center select-none pointer-events-none min-w-[140px] font-sans">
          <div className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">Admin Hall</div>
          <div className="text-blue-400 text-[8px] font-bold tracking-wider mt-0.5 uppercase whitespace-nowrap">Campus Headquarters</div>
        </div>
      </Html>
    </group>

    {/* Front columns */}
    {[-7, -3.5, 3.5, 7].map((x, i) => (
      <RigidBody key={i} type="fixed" colliders="cuboid">
        <mesh castShadow position={[x, 4.5, 7.2]}>
          <cylinderGeometry args={[0.32, 0.38, 9, 10]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.85} />
        </mesh>
      </RigidBody>
    ))}

    {/* Steps */}
    {[0.35, 0.2, 0.08].map((y, i) => (
      <mesh key={i} receiveShadow position={[0, y, 7.8 + i * 0.55]}>
        <boxGeometry args={[12 + i * 1.5, 0.22, 0.95]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.9} />
      </mesh>
    ))}

    {/* ── Interior ──────────────────────────────────────────────────── */}
    {/* Reception floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 1]}>
      <planeGeometry args={[21, 12]} />
      <meshStandardMaterial color="#f8f8f0" roughness={0.8} />
    </mesh>

    {/* Reception counter */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[0, 0.7, 4]}>
        <boxGeometry args={[7, 1.4, 1.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </RigidBody>
    <mesh position={[0, 1.38, 4]}>
      <boxGeometry args={[7.1, 0.06, 1.2]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
    </mesh>
    <Computer position={[-1.5, 1.41, 4.3]} rotationY={Math.PI} screenColor="#3b82f6" />
    <Computer position={[1.5, 1.41, 4.3]} rotationY={Math.PI} screenColor="#3b82f6" />

    {/* "Receptionist" sign above desk */}
    <mesh position={[0, 2.4, 4.1]}>
      <boxGeometry args={[3.5, 0.5, 0.08]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.4} />
    </mesh>

    {/* Waiting chairs */}
    {[-6, -4, -2, 0, 2].map((x, i) => (
      <group key={i} position={[x, 0, 1]}>
        <mesh castShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[0.55, 0.1, 0.55]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 0.75, -0.23]}>
          <boxGeometry args={[0.55, 0.55, 0.07]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.07]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>
    ))}

    {/* Prof Orion's door */}
    <mesh position={[8, 1.5, -1]}>
      <boxGeometry args={[0.1, 3.0, 1.6]} />
      <meshStandardMaterial color="#7a5230" roughness={0.9} />
    </mesh>
    <mesh position={[8.06, 1.8, -0.4]}>
      <boxGeometry args={[0.02, 0.35, 1.2]} />
      <meshStandardMaterial color="#e2c97e" emissive="#e2c97e" emissiveIntensity={0.15} roughness={0.5} />
    </mesh>

    {/* ── Exterior surroundings ─────────────────────────────────────── */}
    <Tree position={[-13, 0, 6]} variant="tall" scale={1.2} />
    <Tree position={[13, 0, 6]} variant="tall" scale={1.2} />
    <Tree position={[-13, 0, -4]} variant="round" scale={0.9} />
    <Tree position={[13, 0, -4]} variant="round" scale={0.9} />

    <Bench position={[-9, 0, 9]} rotationY={0.3} />
    <Bench position={[9, 0, 9]} rotationY={-0.3} />

    <Lamp position={[-8, 0, 8]} />
    <Lamp position={[8, 0, 8]} />
  </group>
);

export default AdministrationBuilding;
