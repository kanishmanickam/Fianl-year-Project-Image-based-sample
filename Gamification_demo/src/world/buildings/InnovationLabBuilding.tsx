import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { Tree, Lamp, Computer } from '../shared/CampusProps';

// Simple robot arm
const RobotArm: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.3, 0]}>
      <boxGeometry args={[0.4, 0.6, 0.4]} />
      <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.6} />
    </mesh>
    <mesh castShadow position={[0, 0.9, 0.3]} rotation={[0.5, 0, 0]}>
      <boxGeometry args={[0.15, 0.7, 0.15]} />
      <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.7} />
    </mesh>
    <mesh castShadow position={[0, 1.35, 0.65]} rotation={[-0.3, 0, 0]}>
      <boxGeometry args={[0.12, 0.55, 0.12]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
    </mesh>
    {/* Claw */}
    <mesh position={[0, 1.65, 0.82]}>
      <sphereGeometry args={[0.09, 6, 5]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} roughness={0.3} />
    </mesh>
  </group>
);

// 3D Printer
const Printer3D: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.5, 0]}>
      <boxGeometry args={[1.0, 1.0, 1.0]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
    </mesh>
    {/* Window */}
    <mesh position={[0, 0.5, 0.51]}>
      <boxGeometry args={[0.7, 0.7, 0.02]} />
      <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} roughness={0.05} metalness={0.5} />
    </mesh>
    {/* Print head */}
    <mesh position={[0, 0.75, 0]}>
      <boxGeometry args={[0.6, 0.06, 0.06]} />
      <meshStandardMaterial color="#f59e0b" roughness={0.4} />
    </mesh>
    {/* Status light */}
    <mesh position={[0.4, 0.92, 0.4]}>
      <sphereGeometry args={[0.055, 6, 5]} />
      <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
    </mesh>
  </group>
);

export const InnovationLabBuilding: React.FC = () => (
  <group position={[20, 0, 20]}>
    {/* ── Exterior (Hollow Walls) ────────────────────────────────────────── */}
    {/* Left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-8, 4.5, 0]}>
        <boxGeometry args={[0.2, 9, 14]} />
        <meshStandardMaterial color="#0f2942" roughness={0.3} metalness={0.4} />
      </mesh>
    </RigidBody>
    {/* Right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[8, 4.5, 0]}>
        <boxGeometry args={[0.2, 9, 14]} />
        <meshStandardMaterial color="#0f2942" roughness={0.3} metalness={0.4} />
      </mesh>
    </RigidBody>
    {/* Back Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 4.5, -7]}>
        <boxGeometry args={[16, 9, 0.2]} />
        <meshStandardMaterial color="#0f2942" roughness={0.3} metalness={0.4} />
      </mesh>
    </RigidBody>
    {/* Front-left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-4.7, 4.5, 7]}>
        <boxGeometry args={[6.6, 9, 0.2]} />
        <meshStandardMaterial color="#0f2942" roughness={0.3} metalness={0.4} />
      </mesh>
    </RigidBody>
    {/* Front-right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[4.7, 4.5, 7]}>
        <boxGeometry args={[6.6, 9, 0.2]} />
        <meshStandardMaterial color="#0f2942" roughness={0.3} metalness={0.4} />
      </mesh>
    </RigidBody>
    {/* Lintel above center door (leaving door height 2.6 clear) */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[0, 5.8, 7]}>
        <boxGeometry args={[2.8, 6.4, 0.2]} />
        <meshStandardMaterial color="#0f2942" roughness={0.3} metalness={0.4} />
      </mesh>
    </RigidBody>

    {/* Roof accent bar */}
    <mesh position={[0, 9.1, 0]}>
      <boxGeometry args={[16.2, 0.3, 14.2]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} roughness={0.3} />
    </mesh>

    {/* Glass south windows (split, leaving center door opening clear) */}
    <group position={[0, 0, 7.05]}>
      <mesh position={[-4.7, 4.5, 0]}>
        <boxGeometry args={[4.6, 7.5, 0.1]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.4} roughness={0.05} metalness={0.8} />
      </mesh>
      <mesh position={[4.7, 4.5, 0]}>
        <boxGeometry args={[4.6, 7.5, 0.1]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.4} roughness={0.05} metalness={0.8} />
      </mesh>
    </group>

    {/* ── Industrial Innovation Open Double Doors ──────────────────────── */}
    <group position={[0, 0, 7.0]}>
      {/* Heavy Steel Door Frame */}
      <mesh position={[-1.4, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[1.4, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.56, 0]}>
        <boxGeometry args={[2.8, 0.08, 0.18]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Swung Open Left Door (swung outward) */}
      <group position={[-1.38, 1.3, 0]} rotation={[0, -Math.PI / 2.2, 0]}>
        <mesh position={[0.65, 0, 0.04]}>
          <boxGeometry args={[1.3, 2.4, 0.08]} />
          <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Circular glass window */}
        <mesh position={[0.65, 0.4, 0.041]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.082, 12]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.5} roughness={0.1} />
        </mesh>
        {/* Metal push bar */}
        <mesh position={[0.65, -0.1, 0.09]}>
          <boxGeometry args={[0.9, 0.05, 0.03]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Swung Open Right Door (swung outward) */}
      <group position={[1.38, 1.3, 0]} rotation={[0, Math.PI / 2.2, 0]}>
        <mesh position={[-0.65, 0, 0.04]}>
          <boxGeometry args={[1.3, 2.4, 0.08]} />
          <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Circular glass window */}
        <mesh position={[-0.65, 0.4, 0.041]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.082, 12]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.5} roughness={0.1} />
        </mesh>
        {/* Metal push bar */}
        <mesh position={[-0.65, -0.1, 0.09]}>
          <boxGeometry args={[0.9, 0.05, 0.03]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>

    {/* "INNOVATION LAB" signage strip */}
    <group position={[0, 8.0, 7.12]}>
      <mesh>
        <boxGeometry args={[10, 0.6, 0.1]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      <Html distanceFactor={15} position={[0, 0, 0.08]} center>
        <div className="bg-slate-950/95 border-2 border-orange-500/80 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.45)] text-center select-none pointer-events-none min-w-[140px] font-sans">
          <div className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">Innovation Lab</div>
          <div className="text-orange-400 text-[8px] font-bold tracking-wider mt-0.5 uppercase whitespace-nowrap">Robotics & AI</div>
        </div>
      </Html>
    </group>

    {/* Steps */}
    {[0.28, 0.14, 0.04].map((y, i) => (
      <mesh key={i} receiveShadow position={[0, y, 7.7 + i * 0.45]}>
        <boxGeometry args={[8 + i, 0.2, 0.8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    ))}

    {/* ── Interior ──────────────────────────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
      <planeGeometry args={[15, 13]} />
      <meshStandardMaterial color="#1e293b" roughness={0.5} />
    </mesh>

    {/* Workbenches */}
    {[-4, 0, 4].map((x, i) => (
      <group key={i} position={[x, 0, -3]}>
        <mesh castShadow position={[0, 0.85, 0]}>
          <boxGeometry args={[2.8, 0.08, 1.1]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </mesh>
        {/* Bench legs */}
        {([-1.2, 1.2] as const).map((lx, li) => (
          <mesh key={li} castShadow position={[lx, 0.42, 0]}>
            <boxGeometry args={[0.07, 0.84, 1.1]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        ))}
      </group>
    ))}

    {/* Robots */}
    <RobotArm position={[-5, 0, -4]} />
    <RobotArm position={[5, 0, -4]} />

    {/* 3D Printers */}
    <Printer3D position={[-3, 0.84, -3.5]} />
    <Printer3D position={[3, 0.84, -3.5]} />

    {/* Computers along side wall */}
    <Computer position={[-6, 0, 2]} rotationY={Math.PI / 2} screenColor="#f59e0b" />
    <Computer position={[-6, 0, 0]} rotationY={Math.PI / 2} screenColor="#f59e0b" />
    <Computer position={[-6, 0, -2]} rotationY={Math.PI / 2} screenColor="#f59e0b" />

    {/* ── Exterior ──────────────────────────────────────────────────── */}
    <Tree position={[-9, 0, 7]} variant="pine" scale={1.0} />
    <Tree position={[9, 0, 7]} variant="pine" scale={1.0} />
    <Lamp position={[-6, 0, 8]} />
    <Lamp position={[6, 0, 8]} />
  </group>
);

export default InnovationLabBuilding;
