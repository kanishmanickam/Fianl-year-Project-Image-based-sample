import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { Tree, Bench, Lamp, FlowerBed } from '../shared/CampusProps';

export const CafeBuilding: React.FC = () => (
  <group position={[-20, 0, 20]}>
    {/* ── Exterior Shell (Hollow Walls) ────────────────────────────────── */}
    {/* Left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-7, 3.5, 0]}>
        <boxGeometry args={[0.2, 7, 12]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[7, 3.5, 0]}>
        <boxGeometry args={[0.2, 7, 12]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Back Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[0, 3.5, -6]}>
        <boxGeometry args={[14, 7, 0.2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Front-left Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[-4.2, 3.5, 6]}>
        <boxGeometry args={[5.6, 7, 0.2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Front-right Wall */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={[4.2, 3.5, 6]}>
        <boxGeometry args={[5.6, 7, 0.2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} />
      </mesh>
    </RigidBody>
    {/* Lintel above center door (leaving door height 2.6 clear) */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[0, 4.8, 6]}>
        <boxGeometry args={[2.8, 4.4, 0.2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.8} />
      </mesh>
    </RigidBody>

    {/* Roof with gentle slope suggestion */}
    <mesh castShadow position={[0, 7.2, 0]}>
      <boxGeometry args={[15, 0.45, 13]} />
      <meshStandardMaterial color="#9a4a28" roughness={0.9} />
    </mesh>

    {/* Awning over entrance */}
    <mesh position={[0, 5.5, 6.5]} rotation={[0.18, 0, 0]}>
      <boxGeometry args={[10, 0.1, 2.5]} />
      <meshStandardMaterial color="#fcd34d" roughness={0.7} />
    </mesh>
    {/* Awning stripes */}
    {[-3, -1, 1, 3].map((x, i) => (
      <mesh key={i} position={[x, 5.49, 6.5]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.5, 0.12, 2.5]} />
        <meshStandardMaterial color="#f97316" roughness={0.7} />
      </mesh>
    ))}

    {/* Front glass windows (split, leaving center door opening clear) */}
    <group position={[0, 0, 6.06]}>
      <mesh position={[-3.7, 3.5, 0]}>
        <boxGeometry args={[3.6, 5.5, 0.1]} />
        <meshStandardMaterial color="#fef3c7" transparent opacity={0.35} roughness={0.1} metalness={0.3} />
      </mesh>
      <mesh position={[3.7, 3.5, 0]}>
        <boxGeometry args={[3.6, 5.5, 0.1]} />
        <meshStandardMaterial color="#fef3c7" transparent opacity={0.35} roughness={0.1} metalness={0.3} />
      </mesh>
    </group>

    {/* ── Cozy Café Open Double Doors ────────────────────────────────── */}
    <group position={[0, 0, 6.0]}>
      {/* Wooden Door Frame */}
      <mesh position={[-1.4, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#5c3d24" roughness={0.7} />
      </mesh>
      <mesh position={[1.4, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#5c3d24" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.56, 0]}>
        <boxGeometry args={[2.8, 0.08, 0.18]} />
        <meshStandardMaterial color="#5c3d24" roughness={0.7} />
      </mesh>

      {/* Swung Open Left Door (swung inward) */}
      <group position={[-1.38, 1.3, 0]} rotation={[0, Math.PI / 2.5, 0]}>
        <mesh position={[0.65, 0, 0.04]}>
          <boxGeometry args={[1.3, 2.4, 0.06]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Large glass window insert */}
        <mesh position={[0.65, 0.1, 0.041]}>
          <boxGeometry args={[0.8, 1.8, 0.062]} />
          <meshStandardMaterial color="#fef3c7" transparent opacity={0.45} roughness={0.15} />
        </mesh>
        {/* Handle */}
        <mesh position={[1.1, 0, 0.09]}>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
          <meshStandardMaterial color="#b45309" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>

      {/* Swung Open Right Door (swung inward) */}
      <group position={[1.38, 1.3, 0]} rotation={[0, -Math.PI / 2.5, 0]}>
        <mesh position={[-0.65, 0, 0.04]}>
          <boxGeometry args={[1.3, 2.4, 0.06]} />
          <meshStandardMaterial color="#92400e" roughness={0.6} />
        </mesh>
        {/* Large glass window insert */}
        <mesh position={[-0.65, 0.1, 0.041]}>
          <boxGeometry args={[0.8, 1.8, 0.062]} />
          <meshStandardMaterial color="#fef3c7" transparent opacity={0.45} roughness={0.15} />
        </mesh>
        {/* Handle */}
        <mesh position={[-1.1, 0, 0.09]}>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
          <meshStandardMaterial color="#b45309" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </group>

    {/* "CAFÉ" sign */}
    <group position={[0, 6.3, 6.15]}>
      <mesh>
        <boxGeometry args={[4.5, 0.65, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>
      <Html distanceFactor={15} position={[0, 0, 0.08]} center>
        <div className="bg-slate-950/95 border-2 border-rose-500/80 px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.45)] text-center select-none pointer-events-none min-w-[140px] font-sans">
          <div className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">Aether Café</div>
          <div className="text-rose-400 text-[8px] font-bold tracking-wider mt-0.5 uppercase whitespace-nowrap">Student Lounge</div>
        </div>
      </Html>
    </group>

    {/* ── Interior ──────────────────────────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
      <planeGeometry args={[13, 11]} />
      <meshStandardMaterial color="#fef9c3" roughness={0.85} />
    </mesh>

    {/* Coffee counter */}
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow position={[-4, 0.7, -2]}>
        <boxGeometry args={[4, 1.4, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
    </RigidBody>
    <mesh position={[-4, 1.4, -2]}>
      <boxGeometry args={[4.1, 0.06, 1.3]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
    </mesh>
    {/* Coffee machine */}
    <mesh castShadow position={[-3.5, 1.55, -2]}>
      <boxGeometry args={[0.7, 0.5, 0.5]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.6} />
    </mesh>
    <mesh position={[-3.5, 1.85, -2]}>
      <sphereGeometry args={[0.1, 6, 5]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
    </mesh>

    {/* Pastry display */}
    <mesh castShadow position={[-5, 1.52, -2]}>
      <boxGeometry args={[0.9, 0.35, 0.7]} />
      <meshStandardMaterial color="#bfdbfe" transparent opacity={0.6} roughness={0.05} metalness={0.4} />
    </mesh>

    {/* Indoor tables (5 total) */}
    {[
      [2, 0, -3], [4.5, 0, -3], [2, 0, 0], [4.5, 0, 0], [3.2, 0, 3],
    ].map(([x, , z], i) => (
      <group key={i} position={[x, 0, z]}>
        {/* Round table */}
        <mesh castShadow position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.07, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
        {/* Chairs */}
        {[0, Math.PI / 2, Math.PI, -Math.PI / 2].slice(0, 3).map((angle, ci) => (
          <group key={ci} position={[Math.cos(angle) * 0.85, 0, Math.sin(angle) * 0.85]} rotation={[0, angle + Math.PI, 0]}>
            <mesh castShadow position={[0, 0.42, 0]}>
              <boxGeometry args={[0.45, 0.06, 0.45]} />
              <meshStandardMaterial color="#f97316" roughness={0.7} />
            </mesh>
            <mesh castShadow position={[0, 0.7, -0.2]}>
              <boxGeometry args={[0.45, 0.42, 0.06]} />
              <meshStandardMaterial color="#f97316" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    ))}

    {/* ── Outdoor seating area ──────────────────────────────────────── */}
    {/* Outdoor patio floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.03, 10]}>
      <planeGeometry args={[16, 8]} />
      <meshStandardMaterial color="#fef3c7" roughness={0.85} />
    </mesh>

    {/* Outdoor tables */}
    {[-4, 0, 4].map((x, i) => (
      <group key={i} position={[x, 0, 10]}>
        <mesh castShadow position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.07, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
          <meshStandardMaterial color="#92400e" roughness={0.7} />
        </mesh>
        {/* Umbrella */}
        <mesh castShadow position={[0, 2.2, 0]}>
          <coneGeometry args={[1.2, 0.5, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#f97316' : '#fcd34d'} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
          <meshStandardMaterial color="#9a4a28" roughness={0.7} />
        </mesh>
      </group>
    ))}

    {/* Outdoor benches */}
    <Bench position={[-7, 0, 10]} rotationY={0} />
    <Bench position={[7, 0, 10]} rotationY={0} />

    {/* Trees and flowers around */}
    <Tree position={[-9, 0, 8]} variant="round" scale={0.9} />
    <Tree position={[9, 0, 8]} variant="round" scale={0.9} />
    <FlowerBed position={[-9, 0, 12]} colors={['#ff4488','#ffcc00','#ff6622']} radius={1.2} count={10} />
    <FlowerBed position={[9, 0, 12]} colors={['#cc44ff','#ff4488','#ffffff']} radius={1.2} count={10} />

    <Lamp position={[-6, 0, 13]} />
    <Lamp position={[6, 0, 13]} />
  </group>
);

export default CafeBuilding;
