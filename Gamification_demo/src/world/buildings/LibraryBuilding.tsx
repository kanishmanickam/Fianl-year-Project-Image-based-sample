import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { Tree, Bench, Lamp, Bookshelf, ReadingTable, Computer } from '../shared/CampusProps';

export const LibraryBuilding: React.FC = () => (
  <group position={[-30, 0, 0]}>
    {/* ── Exterior Shell (Hollow Walls) ────────────────────────────────── */}
    {/* Left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-9, 5, 0]}>
        <boxGeometry args={[0.2, 10, 16]} />
        <meshStandardMaterial color="#a85632" roughness={0.85} />
      </mesh>
    </RigidBody>
    {/* Right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[9, 5, 0]}>
        <boxGeometry args={[0.2, 10, 16]} />
        <meshStandardMaterial color="#a85632" roughness={0.85} />
      </mesh>
    </RigidBody>
    {/* Back Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 5, -8]}>
        <boxGeometry args={[18, 10, 0.2]} />
        <meshStandardMaterial color="#a85632" roughness={0.85} />
      </mesh>
    </RigidBody>
    {/* Front-left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-5.4, 5, 8]}>
        <boxGeometry args={[7.2, 10, 0.2]} />
        <meshStandardMaterial color="#a85632" roughness={0.85} />
      </mesh>
    </RigidBody>
    {/* Front-right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[5.4, 5, 8]}>
        <boxGeometry args={[7.2, 10, 0.2]} />
        <meshStandardMaterial color="#a85632" roughness={0.85} />
      </mesh>
    </RigidBody>
    {/* Lintel above center door (leaving door height 2.6 clear) */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[0, 6.3, 8]}>
        <boxGeometry args={[3.6, 7.4, 0.2]} />
        <meshStandardMaterial color="#a85632" roughness={0.85} />
      </mesh>
    </RigidBody>

    {/* Roof */}
    <mesh castShadow position={[0, 10.4, 0]}>
      <boxGeometry args={[19, 0.8, 17]} />
      <meshStandardMaterial color="#8a6930" roughness={0.9} />
    </mesh>

    {/* Front glass windows (split, leaving center door opening clear) */}
    <group position={[0, 0, 8.06]}>
      <mesh position={[-5.4, 4.0, 0]}>
        <boxGeometry args={[5.0, 7.5, 0.1]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.35} roughness={0.05} metalness={0.6} />
      </mesh>
      <mesh position={[5.4, 4.0, 0]}>
        <boxGeometry args={[5.0, 7.5, 0.1]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.35} roughness={0.05} metalness={0.6} />
      </mesh>
    </group>

    {/* ── Grand Library Open Double Doors ─────────────────────────────── */}
    <group position={[0, 0, 8.0]}>
      {/* Wooden Door Frame */}
      <mesh position={[-1.75, 1.3, 0]}>
        <boxGeometry args={[0.1, 2.6, 0.22]} />
        <meshStandardMaterial color="#5c3d24" roughness={0.7} />
      </mesh>
      <mesh position={[1.75, 1.3, 0]}>
        <boxGeometry args={[0.1, 2.6, 0.22]} />
        <meshStandardMaterial color="#5c3d24" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[3.6, 0.1, 0.22]} />
        <meshStandardMaterial color="#5c3d24" roughness={0.7} />
      </mesh>

      {/* Swung Open Left Door (swung inward) */}
      <group position={[-1.7, 1.3, 0]} rotation={[0, Math.PI / 2.5, 0]}>
        <mesh position={[0.8, 0, 0.05]}>
          <boxGeometry args={[1.6, 2.4, 0.08]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.6} />
        </mesh>
        {/* Glass inlay */}
        <mesh position={[0.8, 0, 0.051]}>
          <boxGeometry args={[1.0, 1.8, 0.082]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        {/* Gold handle */}
        <mesh position={[1.4, 0, 0.12]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Swung Open Right Door (swung inward) */}
      <group position={[1.7, 1.3, 0]} rotation={[0, -Math.PI / 2.5, 0]}>
        <mesh position={[-0.8, 0, 0.05]}>
          <boxGeometry args={[1.6, 2.4, 0.08]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.6} />
        </mesh>
        {/* Glass inlay */}
        <mesh position={[-0.8, 0, 0.051]}>
          <boxGeometry args={[1.0, 1.8, 0.082]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        {/* Gold handle */}
        <mesh position={[-1.4, 0, 0.12]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>

    {/* Classic columns */}
    {[-5.5, 0, 5.5].map((x, i) => (
      <RigidBody key={i} type="fixed" colliders="cuboid">
        <mesh castShadow position={[x, 4, 8.3]}>
          <cylinderGeometry args={[0.38, 0.45, 8, 10]} />
          <meshStandardMaterial color="#f5f0e8" roughness={0.85} />
        </mesh>
      </RigidBody>
    ))}

    {/* Steps */}
    {[0.3, 0.15, 0.04].map((y, i) => (
      <mesh key={i} receiveShadow position={[0, y, 8.9 + i * 0.5]}>
        <boxGeometry args={[12 + i, 0.2, 0.85]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
      </mesh>
    ))}

    {/* "LIBRARY" sign */}
    <group position={[0, 9.0, 8.1]}>
      <mesh>
        <boxGeometry args={[6, 0.7, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <Html distanceFactor={15} position={[0, 0, 0.08]} center>
        <div className="bg-slate-950/95 border-2 border-amber-600/80 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(217,119,6,0.45)] text-center select-none pointer-events-none min-w-[140px] font-sans">
          <div className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">Library</div>
          <div className="text-amber-500 text-[8px] font-bold tracking-wider mt-0.5 uppercase whitespace-nowrap">Aether Institute</div>
        </div>
      </Html>
    </group>

    {/* ── Interior ──────────────────────────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
      <planeGeometry args={[17, 15]} />
      <meshStandardMaterial color="#fef9c3" roughness={0.85} />
    </mesh>

    {/* Bookshelves along walls */}
    <Bookshelf position={[-6, 0, -4]} rotationY={Math.PI / 2} />
    <Bookshelf position={[-6, 0, 0]} rotationY={Math.PI / 2} />
    <Bookshelf position={[-6, 0, 4]} rotationY={Math.PI / 2} />
    <Bookshelf position={[6, 0, -4]} rotationY={-Math.PI / 2} />
    <Bookshelf position={[6, 0, 0]} rotationY={-Math.PI / 2} />
    <Bookshelf position={[6, 0, 4]} rotationY={-Math.PI / 2} />
    <Bookshelf position={[0, 0, -6]} rotationY={Math.PI} />
    <Bookshelf position={[3.5, 0, -6]} rotationY={Math.PI} />
    <Bookshelf position={[-3.5, 0, -6]} rotationY={Math.PI} />

    {/* Reading tables */}
    <ReadingTable position={[-2, 0, 2]} />
    <ReadingTable position={[2, 0, 2]} />
    <ReadingTable position={[0, 0, 5]} />

    {/* Computer terminals */}
    <Computer position={[-4, 0, 6]} rotationY={Math.PI * 0.5} screenColor="#f59e0b" />
    <Computer position={[-2.2, 0, 6]} rotationY={Math.PI * 0.5} screenColor="#f59e0b" />
    <Computer position={[-0.4, 0, 6]} rotationY={Math.PI * 0.5} screenColor="#f59e0b" />

    {/* ── Exterior decorations ──────────────────────────────────────── */}
    <Tree position={[-10, 0, 7]} variant="round" scale={1.1} />
    <Tree position={[10, 0, 7]} variant="round" scale={1.0} />
    <Tree position={[-10, 0, -5]} variant="tall" scale={0.9} />
    <Tree position={[10, 0, -5]} variant="tall" scale={0.9} />

    <Bench position={[-8, 0, 9.5]} rotationY={0.2} />
    <Bench position={[8, 0, 9.5]} rotationY={-0.2} />
    <Lamp position={[-6, 0, 9]} />
    <Lamp position={[6, 0, 9]} />
  </group>
);

export default LibraryBuilding;
