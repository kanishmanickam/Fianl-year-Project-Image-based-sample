import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { Bench, Lamp, Tree } from '../shared/CampusProps';

// Animated water surface
const FountainWater: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = 0.38 + Math.sin(t * 1.2) * 0.015;
    }
  });
  return (
    <mesh ref={ref} receiveShadow position={[0, 0.38, 0]}>
      <cylinderGeometry args={[3.8, 3.8, 0.06, 32]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} roughness={0.05} metalness={0.3} />
    </mesh>
  );
};

export const CentralPlaza: React.FC = () => (
  <group position={[0, 0, 0]}>
    {/* ── Paved plaza circle ─────────────────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.02, 0]}>
      <circleGeometry args={[14, 32]} />
      <meshStandardMaterial color="#c8bfa0" roughness={0.85} />
    </mesh>

    {/* ── Fountain basin ────────────────────────────────────────────── */}
    <RigidBody type="fixed" colliders="trimesh">
      <group position={[0, 0, 0]}>
        {/* Outer ring */}
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
          <torusGeometry args={[4.0, 0.28, 8, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Basin floor */}
        <mesh receiveShadow position={[0, 0.02, 0]}>
          <cylinderGeometry args={[3.78, 3.78, 0.04, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
        {/* Center column */}
        <mesh castShadow position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.28, 0.35, 1.8, 10]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
        </mesh>
        {/* Top dish */}
        <mesh castShadow position={[0, 1.85, 0]}>
          <cylinderGeometry args={[1.2, 0.9, 0.22, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
        </mesh>
        {/* Water spout glow */}
        <mesh position={[0, 2.05, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={0.6} transparent opacity={0.8} />
        </mesh>
      </group>
    </RigidBody>
    <FountainWater />

    {/* ── Campus Map Board ─────────────────────────────────────────── */}
    <group position={[7, 0, 7]}>
      {/* Post */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 1.8, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      {/* Board */}
      <mesh castShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[1.6, 1.1, 0.08]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.5} />
      </mesh>
      {/* Map face */}
      <mesh position={[0, 1.9, 0.045]}>
        <boxGeometry args={[1.45, 0.95, 0.01]} />
        <meshStandardMaterial color="#bfdbfe" emissive="#3b82f6" emissiveIntensity={0.08} roughness={0.4} />
      </mesh>
      {/* Building dots on map */}
      {[
        { x: 0, z: 0, color: '#22c55e' },
        { x: -0.35, z: 0.15, color: '#3b82f6' },
        { x: 0.3, z: 0.15, color: '#f59e0b' },
        { x: 0, z: -0.3, color: '#a855f7' },
      ].map((dot, i) => (
        <mesh key={i} position={[dot.x * 0.9, 1.9 + dot.z * 0.6, 0.055]}>
          <circleGeometry args={[0.04, 6]} />
          <meshStandardMaterial color={dot.color} emissive={dot.color} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>

    {/* ── Benches around fountain ───────────────────────────────────── */}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const r = 6.5;
      return (
        <Bench
          key={i}
          position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
          rotationY={angle + Math.PI / 2}
        />
      );
    })}

    {/* ── Lamps around plaza ───────────────────────────────────────── */}
    {[0, 1, 2, 3].map((i) => {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const r = 11;
      return (
        <Lamp key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} />
      );
    })}

    {/* ── Corner Trees ─────────────────────────────────────────────── */}
    {[
      [-12, -12], [12, -12], [-12, 12], [12, 12],
      [-9, 0], [9, 0], [0, -9], [0, 9],
    ].map(([x, z], i) => (
      <Tree key={i} position={[x, 0, z]} scale={0.85 + (i % 3) * 0.1} variant={i % 2 === 0 ? 'round' : 'tall'} />
    ))}
  </group>
);

export default CentralPlaza;
