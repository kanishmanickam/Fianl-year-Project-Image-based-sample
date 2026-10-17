import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Tree, Bench, FlowerBed, Lamp } from '../shared/CampusProps';

export const MainEntrance: React.FC = () => (
  <group position={[0, 0, 52]}>
    {/* ── Gate Pillars ──────────────────────────────────────────────────── */}
    {([-6, 6] as const).map((x) => (
      <RigidBody key={x} type="fixed" colliders="cuboid">
        <group position={[x, 0, 0]}>
          {/* Main pillar */}
          <mesh castShadow receiveShadow position={[0, 4, 0]}>
            <boxGeometry args={[1.4, 8, 1.4]} />
            <meshStandardMaterial color="#f0ece0" roughness={0.8} />
          </mesh>
          {/* Cap */}
          <mesh castShadow position={[0, 8.25, 0]}>
            <boxGeometry args={[1.7, 0.5, 1.7]} />
            <meshStandardMaterial color="#d4c5a9" roughness={0.7} />
          </mesh>
          {/* University crest sphere */}
          <mesh castShadow position={[0, 8.8, 0]}>
            <sphereGeometry args={[0.45, 10, 8]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      </RigidBody>
    ))}

    {/* ── Arch beam across top ──────────────────────────────────────────── */}
    <mesh castShadow position={[0, 8.0, 0]}>
      <boxGeometry args={[12, 0.55, 0.8]} />
      <meshStandardMaterial color="#f0ece0" roughness={0.8} />
    </mesh>

    {/* ── University Sign on arch ───────────────────────────────────────── */}
    <mesh position={[0, 8.0, -0.15]}>
      <boxGeometry args={[8, 0.9, 0.1]} />
      <meshStandardMaterial color="#1e40af" roughness={0.4} />
    </mesh>
    {/* Sign glow strip */}
    <mesh position={[0, 8.0, -0.21]}>
      <boxGeometry args={[7.6, 0.55, 0.02]} />
      <meshStandardMaterial color="#93c5fd" emissive="#93c5fd" emissiveIntensity={0.4} roughness={0.2} />
    </mesh>

    {/* ── Side Walls ────────────────────────────────────────────────────── */}
    <RigidBody type="fixed" colliders="cuboid">
      {/* Left wall */}
      <mesh castShadow receiveShadow position={[-18, 1.2, 0]}>
        <boxGeometry args={[24, 2.4, 0.5]} />
        <meshStandardMaterial color="#e8e0cc" roughness={0.9} />
      </mesh>
    </RigidBody>
    <RigidBody type="fixed" colliders="cuboid">
      {/* Right wall */}
      <mesh castShadow receiveShadow position={[18, 1.2, 0]}>
        <boxGeometry args={[24, 2.4, 0.5]} />
        <meshStandardMaterial color="#e8e0cc" roughness={0.9} />
      </mesh>
    </RigidBody>

    {/* ── Security Guard Post ───────────────────────────────────────────── */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[9, 1.0, 0]}>
        <boxGeometry args={[2.0, 2.0, 2.0]} />
        <meshStandardMaterial color="#d0cdc5" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Booth window */}
    <mesh position={[9, 1.1, -1.01]}>
      <boxGeometry args={[1.2, 0.9, 0.05]} />
      <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} roughness={0.1} metalness={0.5} />
    </mesh>

    {/* ── Trees lining the entrance road ───────────────────────────────── */}
    {[-12, -8, 8, 12].map((x) => (
      <Tree key={x} position={[x, 0, -8]} scale={1.1} variant="round" />
    ))}
    {[-14, -10, 10, 14].map((x) => (
      <Tree key={x} position={[x, 0, 4]} scale={0.9} variant="tall" />
    ))}

    {/* ── Flower beds by pillars ────────────────────────────────────────── */}
    <FlowerBed position={[-6, 0, -3.5]} colors={['#ff4488','#ff6622','#ffcc00']} radius={1.2} count={10} />
    <FlowerBed position={[6, 0, -3.5]} colors={['#cc44ff','#4488ff','#ffffff']} radius={1.2} count={10} />
    <FlowerBed position={[-18, 0, -2]} colors={['#ff4488','#ffcc00']} radius={1.5} count={12} />
    <FlowerBed position={[18, 0, -2]} colors={['#ff6622','#cc44ff']} radius={1.5} count={12} />

    {/* ── Benches ───────────────────────────────────────────────────────── */}
    <Bench position={[-10, 0, -6]} rotationY={Math.PI * 0.15} />
    <Bench position={[10, 0, -6]} rotationY={-Math.PI * 0.15} />

    {/* ── Lamps ─────────────────────────────────────────────────────────── */}
    {[-8, 8].map((x) => (
      <Lamp key={x} position={[x, 0, -2]} />
    ))}
  </group>
);

export default MainEntrance;
