import React from 'react';

// ─── Reusable Tree ────────────────────────────────────────────────────────────
interface TreeProps {
  position: [number, number, number];
  scale?: number;
  variant?: 'round' | 'tall' | 'pine';
}
export const Tree: React.FC<TreeProps> = ({ position, scale = 1, variant = 'round' }) => (
  <group position={position} scale={scale}>
    {/* Trunk */}
    <mesh castShadow position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.22, 0.32, 3, 8]} />
      <meshStandardMaterial color="#7a5230" roughness={0.95} />
    </mesh>
    {variant === 'round' && (
      <>
        <mesh castShadow position={[0, 4.8, 0]}>
          <sphereGeometry args={[2.0, 8, 7]} />
          <meshStandardMaterial color="#3a8a35" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.6, 4.0, 0.6]}>
          <sphereGeometry args={[1.1, 7, 6]} />
          <meshStandardMaterial color="#4aaa3f" roughness={0.9} />
        </mesh>
      </>
    )}
    {variant === 'tall' && (
      <>
        <mesh castShadow position={[0, 5.5, 0]}>
          <sphereGeometry args={[1.4, 8, 7]} />
          <meshStandardMaterial color="#2d7040" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 4.0, 0]}>
          <sphereGeometry args={[1.8, 8, 7]} />
          <meshStandardMaterial color="#3a8a50" roughness={0.9} />
        </mesh>
      </>
    )}
    {variant === 'pine' && (
      <>
        <mesh castShadow position={[0, 5.5, 0]}>
          <coneGeometry args={[1.0, 2.5, 8]} />
          <meshStandardMaterial color="#2d6030" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 4.0, 0]}>
          <coneGeometry args={[1.6, 2.5, 8]} />
          <meshStandardMaterial color="#358040" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 2.5, 0]}>
          <coneGeometry args={[2.0, 2.0, 8]} />
          <meshStandardMaterial color="#40a050" roughness={0.9} />
        </mesh>
      </>
    )}
  </group>
);

// ─── Bench ────────────────────────────────────────────────────────────────────
interface BenchProps {
  position: [number, number, number];
  rotationY?: number;
}
export const Bench: React.FC<BenchProps> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Seat */}
    <mesh castShadow position={[0, 0.42, 0]}>
      <boxGeometry args={[1.8, 0.08, 0.55]} />
      <meshStandardMaterial color="#a0783a" roughness={0.9} />
    </mesh>
    {/* Back rest */}
    <mesh castShadow position={[0, 0.72, -0.22]}>
      <boxGeometry args={[1.8, 0.42, 0.07]} />
      <meshStandardMaterial color="#a0783a" roughness={0.9} />
    </mesh>
    {/* Legs */}
    {([-0.7, 0.7] as const).map((x, i) => (
      <mesh key={i} castShadow position={[x, 0.2, 0]}>
        <boxGeometry args={[0.09, 0.4, 0.52]} />
        <meshStandardMaterial color="#607080" roughness={0.6} />
      </mesh>
    ))}
  </group>
);

// ─── Flower Bed ───────────────────────────────────────────────────────────────
interface FlowerBedProps {
  position: [number, number, number];
  colors?: string[];
  radius?: number;
  count?: number;
}
export const FlowerBed: React.FC<FlowerBedProps> = ({
  position,
  colors = ['#ff4488','#ffcc00','#ff6622','#cc44ff','#ff3333','#ffffff'],
  radius = 1.5,
  count = 12,
}) => (
  <group position={position}>
    {/* Soil */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      <circleGeometry args={[radius + 0.3, 16]} />
      <meshStandardMaterial color="#5a3d1e" roughness={0.98} />
    </mesh>
    {/* Green ground cover */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <circleGeometry args={[radius, 16]} />
      <meshStandardMaterial color="#4aaa35" roughness={0.95} />
    </mesh>
    {/* Flowers */}
    {Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * (0.3 + Math.random() * 0.6);
      const color = colors[i % colors.length];
      return (
        <group key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
          {/* Stem */}
          <mesh castShadow position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.36, 5]} />
            <meshStandardMaterial color="#33aa22" roughness={0.9} />
          </mesh>
          {/* Bloom */}
          <mesh castShadow position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.14, 6, 5]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        </group>
      );
    })}
  </group>
);

// ─── Street Lamp ─────────────────────────────────────────────────────────────
interface LampProps {
  position: [number, number, number];
}
export const Lamp: React.FC<LampProps> = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 2.5, 0]}>
      <cylinderGeometry args={[0.06, 0.09, 5, 8]} />
      <meshStandardMaterial color="#4a5568" roughness={0.5} />
    </mesh>
    {/* Arm */}
    <mesh position={[0.5, 4.9, 0]} rotation={[0, 0, -0.2]}>
      <cylinderGeometry args={[0.04, 0.04, 1.1, 6]} />
      <meshStandardMaterial color="#4a5568" roughness={0.5} />
    </mesh>
    {/* Globe */}
    <mesh position={[0.95, 4.85, 0]}>
      <sphereGeometry args={[0.22, 8, 6]} />
      <meshStandardMaterial color="#fffde0" emissive="#ffd070" emissiveIntensity={0.6} roughness={0.3} />
    </mesh>
  </group>
);

// ─── Computer Terminal ────────────────────────────────────────────────────────
interface ComputerProps {
  position: [number, number, number];
  rotationY?: number;
  screenColor?: string;
}
export const Computer: React.FC<ComputerProps> = ({
  position, rotationY = 0, screenColor = '#00f0ff',
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Desk */}
    <mesh castShadow position={[0, 0.38, 0]}>
      <boxGeometry args={[1.4, 0.06, 0.75]} />
      <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
    </mesh>
    {/* Monitor */}
    <mesh castShadow position={[0, 0.85, -0.25]}>
      <boxGeometry args={[0.9, 0.55, 0.06]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.85, -0.22]}>
      <boxGeometry args={[0.78, 0.44, 0.01]} />
      <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.5} roughness={0.1} />
    </mesh>
    {/* Stand */}
    <mesh castShadow position={[0, 0.55, -0.22]}>
      <cylinderGeometry args={[0.04, 0.06, 0.3, 6]} />
      <meshStandardMaterial color="#4a5568" roughness={0.4} />
    </mesh>
    {/* Keyboard */}
    <mesh position={[0, 0.42, 0.05]}>
      <boxGeometry args={[0.65, 0.025, 0.2]} />
      <meshStandardMaterial color="#2d3748" roughness={0.7} />
    </mesh>
  </group>
);

// ─── Bookshelf ────────────────────────────────────────────────────────────────
interface BookshelfProps {
  position: [number, number, number];
  rotationY?: number;
}
export const Bookshelf: React.FC<BookshelfProps> = ({ position, rotationY = 0 }) => {
  const shelfColors = ['#e53e3e','#3182ce','#38a169','#d69e2e','#805ad5','#dd6b20'];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Frame */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[2.2, 3.0, 0.35]} />
        <meshStandardMaterial color="#7a5230" roughness={0.9} />
      </mesh>
      {/* Shelves & books */}
      {[0.2, 0.9, 1.6, 2.3].map((y, si) => (
        <group key={si} position={[0, y, 0.1]}>
          <mesh>
            <boxGeometry args={[2.1, 0.05, 0.3]} />
            <meshStandardMaterial color="#a0783a" roughness={0.9} />
          </mesh>
          {Array.from({ length: 8 }).map((_, bi) => (
            <mesh key={bi} castShadow position={[-0.85 + bi * 0.24, 0.22, 0]}>
              <boxGeometry args={[0.18, 0.38, 0.22]} />
              <meshStandardMaterial color={shelfColors[(si * 8 + bi) % shelfColors.length]} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// ─── Reading Table ────────────────────────────────────────────────────────────
interface ReadingTableProps {
  position: [number, number, number];
  rotationY?: number;
}
export const ReadingTable: React.FC<ReadingTableProps> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh castShadow position={[0, 0.75, 0]}>
      <boxGeometry args={[2.2, 0.07, 1.0]} />
      <meshStandardMaterial color="#c8a96a" roughness={0.8} />
    </mesh>
    {/* Legs */}
    {([[-0.9, 0.4], [0.9, 0.4], [-0.9, -0.4], [0.9, -0.4]] as [number, number][]).map(([x, z], i) => (
      <mesh key={i} castShadow position={[x, 0.37, z]}>
        <boxGeometry args={[0.08, 0.74, 0.08]} />
        <meshStandardMaterial color="#8a6030" roughness={0.9} />
      </mesh>
    ))}
  </group>
);
