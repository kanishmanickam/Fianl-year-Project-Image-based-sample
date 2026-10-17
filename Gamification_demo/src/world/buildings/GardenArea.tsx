import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Tree, Bench, FlowerBed } from '../shared/CampusProps';

// Animated small pond surface
const Pond: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      (ref.current.material as THREE.MeshStandardMaterial).opacity = 0.78 + Math.sin(t * 0.8) * 0.05;
    }
  });
  return (
    <group position={position}>
      {/* Pond border */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[2.8, 3.4, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>
      {/* Water */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <circleGeometry args={[2.8, 24]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.80} roughness={0.05} metalness={0.2} />
      </mesh>
      {/* Lily pads */}
      {[0, 1.2, 2.4].map((angle, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, angle, 0]}
          position={[Math.cos(angle * 2) * 1.5, 0.14, Math.sin(angle * 2) * 1.5]}>
          <circleGeometry args={[0.25, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Stone garden path segment
const PathSegment: React.FC<{ points: [number, number][]; y?: number }> = ({ points, y = 0.04 }) => (
  <>
    {points.map(([x, z], i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[x, y, z]}>
        <circleGeometry args={[0.5, 8]} />
        <meshStandardMaterial color="#d4c5a9" roughness={0.9} />
      </mesh>
    ))}
  </>
);

export const GardenArea: React.FC = () => (
  <group position={[0, 0, 30]}>
    {/* ── Ground cover ──────────────────────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.01, 0]}>
      <circleGeometry args={[18, 32]} />
      <meshStandardMaterial color="#4aaa35" roughness={0.95} />
    </mesh>

    {/* ── Winding stone path ────────────────────────────────────────── */}
    <PathSegment points={[
      [0, -12], [0.5, -10], [1.2, -8], [2, -6], [2.5, -4],
      [2, -2], [1, 0], [0, 2], [-1, 4], [-1.5, 6],
      [-1, 8], [0, 10], [0.5, 12],
    ]} />

    {/* ── Pond ─────────────────────────────────────────────────────── */}
    <Pond position={[-6, 0, 2]} />

    {/* ── Trees ────────────────────────────────────────────────────── */}
    {[
      { p: [-10, 0, -8] as [number, number, number], v: 'round' as const, s: 1.2 },
      { p: [10, 0, -8] as [number, number, number], v: 'tall' as const, s: 1.1 },
      { p: [-12, 0, 4] as [number, number, number], v: 'round' as const, s: 1.0 },
      { p: [12, 0, 4] as [number, number, number], v: 'pine' as const, s: 1.0 },
      { p: [-8, 0, 10] as [number, number, number], v: 'tall' as const, s: 0.9 },
      { p: [8, 0, 10] as [number, number, number], v: 'round' as const, s: 1.1 },
      { p: [-4, 0, -10] as [number, number, number], v: 'pine' as const, s: 0.9 },
      { p: [4, 0, -10] as [number, number, number], v: 'round' as const, s: 0.95 },
      { p: [0, 0, 14] as [number, number, number], v: 'tall' as const, s: 1.2 },
      { p: [-6, 0, 14] as [number, number, number], v: 'round' as const, s: 1.0 },
      { p: [6, 0, 14] as [number, number, number], v: 'pine' as const, s: 1.0 },
    ].map(({ p, v, s }, i) => (
      <Tree key={i} position={p} variant={v} scale={s} />
    ))}

    {/* ── Flower beds ───────────────────────────────────────────────── */}
    <FlowerBed position={[7, 0, -4]} colors={['#ff4488','#ffcc00','#ff6622','#cc44ff']} radius={1.8} count={16} />
    <FlowerBed position={[-3, 0, 6]} colors={['#ff3333','#ffffff','#4488ff']} radius={1.5} count={14} />
    <FlowerBed position={[5, 0, 9]} colors={['#ffcc00','#ff4488','#22cc88']} radius={1.3} count={12} />
    <FlowerBed position={[-8, 0, -4]} colors={['#cc44ff','#ffffff','#ff6622']} radius={1.4} count={12} />
    <FlowerBed position={[0, 0, -6]} colors={['#ff4488','#ffcc00']} radius={1.6} count={14} />

    {/* ── Benches along path ────────────────────────────────────────── */}
    <Bench position={[4, 0, -2]} rotationY={0.4} />
    <Bench position={[-4, 0, 3]} rotationY={-0.3} />
    <Bench position={[3, 0, 8]} rotationY={0.8} />
    <Bench position={[-3, 0, 11]} rotationY={-0.5} />

    {/* ── Decorative archway / trellis ─────────────────────────────── */}
    <group position={[0, 0, -13]}>
      {/* Left post */}
      <mesh castShadow position={[-1.5, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 3.0, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Right post */}
      <mesh castShadow position={[1.5, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 3.0, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Top arch */}
      <mesh castShadow position={[0, 3.05, 0]}>
        <torusGeometry args={[1.5, 0.08, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Climbing flowers on arch */}
      {[-1.2, -0.5, 0.5, 1.2].map((x, i) => (
        <mesh key={i} castShadow position={[x, 2.5 + Math.abs(x) * 0.3, 0]}>
          <sphereGeometry args={[0.12, 6, 5]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#ff4488' : '#ffcc00'} roughness={0.7} />
        </mesh>
      ))}
    </group>

    {/* ── Small gazebo near pond ────────────────────────────────────── */}
    <group position={[-6, 0, -5]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.06, 0]}>
        <circleGeometry args={[2.5, 8]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.85} />
      </mesh>
      {/* Posts */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(angle) * 2.2, 1.5, Math.sin(angle) * 2.2]}>
            <cylinderGeometry args={[0.1, 0.1, 3.0, 8]} />
            <meshStandardMaterial color="#d4c5a9" roughness={0.8} />
          </mesh>
        );
      })}
      {/* Dome roof */}
      <mesh castShadow position={[0, 3.4, 0]}>
        <sphereGeometry args={[2.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#a8d5e2" transparent opacity={0.6} roughness={0.1} />
      </mesh>
    </group>
  </group>
);

export default GardenArea;
