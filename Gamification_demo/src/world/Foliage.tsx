import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GrassItem {
  pos: [number, number, number];
  scale: number;
}

export const Foliage: React.FC = () => {
  const treesGroupRef = useRef<THREE.Group>(null);
  const grassRef = useRef<THREE.InstancedMesh>(null);

  // Generate random coordinates for trees and grass
  const { treePositions, grassData } = useMemo(() => {
    const trees: [number, number, number][] = [];
    const grass: GrassItem[] = [];

    // Spawn 15 stylized trees around the campus map
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const radius = 10 + Math.random() * 20;
      trees.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ]);
    }

    // Spawn 200 clumps of grass
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 28;
      grass.push({
        pos: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
          0.05,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 2,
        ],
        scale: 0.3 + Math.random() * 0.7,
      });
    }

    return { treePositions: trees, grassData: grass };
  }, []);

  // Update grass transformations
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const windStrength = 0.08;
    const windSpeed = 1.5;

    // 1. Animate Tree Canopies (sway leaves)
    if (treesGroupRef.current) {
      treesGroupRef.current.children.forEach((tree, idx) => {
        // Find the leaf mesh (second child of tree group usually)
        const leaves = tree.children[1];
        if (leaves) {
          const offset = idx * 0.5;
          leaves.rotation.x = Math.sin(elapsed * windSpeed + offset) * windStrength * 0.5;
          leaves.rotation.z = Math.cos(elapsed * windSpeed + offset) * windStrength * 0.5;
        }
      });
    }

    // 2. Animate Instanced Grass Clumps
    if (grassRef.current) {
      grassData.forEach((g: GrassItem, idx: number) => {
        const offset = idx * 0.05;
        // Calculate sway rotation
        const swayX = Math.sin(elapsed * 2.0 + offset) * 0.1;
        const swayZ = Math.cos(elapsed * 1.8 + offset) * 0.08;

        tempObject.position.set(g.pos[0], g.pos[1], g.pos[2]);
        tempObject.rotation.set(swayX, 0, swayZ);
        tempObject.scale.set(g.scale, g.scale * (1.0 + Math.sin(elapsed * 3 + offset) * 0.1), g.scale);
        tempObject.updateMatrix();

        grassRef.current!.setMatrixAt(idx, tempObject.matrix);
      });
      grassRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Trees Container */}
      <group ref={treesGroupRef}>
        {treePositions.map((pos: [number, number, number], idx: number) => (
          <group key={`tree-${idx}`} position={pos}>
            {/* Trunk */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.35, 2.5, 8]} />
              <meshStandardMaterial color="#5c4033" roughness={0.9} />
            </mesh>
            {/* Stylized Canopy (Foliage) */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <dodecahedronGeometry args={[1.5, 1]} />
              <meshStandardMaterial color="#2d6a4f" roughness={0.8} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* Instanced Grass Blades */}
      <instancedMesh
        ref={grassRef}
        args={[null as any, null as any, grassData.length]}
        castShadow
      >
        <coneGeometry args={[0.08, 0.8, 4]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  );
};

export default Foliage;
