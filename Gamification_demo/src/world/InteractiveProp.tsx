import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useInput from '../hooks/useInput';
import audioManager from '../audio/AudioManager';

export type PropType =
  | 'bench'
  | 'book'
  | 'computer'
  | 'quest_item'
  | 'map'
  | 'sign'
  | 'coffee_machine'
  | 'poster'
  | 'artwork'
  | 'server_terminal'
  | 'whiteboard'
  | 'elevator'
  | 'door';

interface InteractivePropProps {
  id: string;
  type: PropType;
  position: [number, number, number];
  rotation?: [number, number, number];
  name: string;
  description?: string;
  onInteract?: () => void;
}

export const InteractiveProp: React.FC<InteractivePropProps> = ({
  id,
  type,
  position,
  rotation = [0, 0, 0],
  name,
  description = '',
  onInteract,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const inputRef = useInput();
  const [isNear, setIsNear] = useState(false);
  const playerRef = useRef<THREE.Object3D | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Cache player object
    if (!playerRef.current) {
      playerRef.current = state.scene.getObjectByName('player') || null;
    }

    if (playerRef.current) {
      const playerPos = new THREE.Vector3();
      playerRef.current.getWorldPosition(playerPos);

      const propPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(propPos);

      const dist = playerPos.distanceTo(propPos);
      const interactiveRange = type === 'elevator' || type === 'door' ? 3.2 : 2.2;

      if (dist < interactiveRange) {
        if (!isNear) {
          setIsNear(true);
        }

        // Trigger interaction on E
        if (inputRef.current.interact) {
          inputRef.current.interact = false; // Consume key
          audioManager.playSFX('button_click');
          if (onInteract) {
            onInteract();
          } else {
            console.log(`Interacted with: ${name} (${type}) - ${description}`);
          }
        }
      } else {
        if (isNear) {
          setIsNear(false);
        }
      }
    }
  });

  // Render stylized models based on prop type
  const renderMesh = () => {
    switch (type) {
      case 'bench':
        return (
          <group>
            {/* Wooden seat slats */}
            <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[1.8, 0.08, 0.6]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
            {/* Seat Back */}
            <mesh castShadow position={[0, 0.8, -0.28]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[1.8, 0.4, 0.06]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
            {/* Metal support brackets */}
            <mesh castShadow position={[-0.8, 0.3, 0]}>
              <boxGeometry args={[0.08, 0.6, 0.58]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh castShadow position={[0.8, 0.3, 0]}>
              <boxGeometry args={[0.08, 0.6, 0.58]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );

      case 'coffee_machine':
        return (
          <group>
            {/* Table base */}
            <mesh castShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[0.8, 0.8, 0.6]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
            {/* Machine unit */}
            <mesh castShadow position={[0, 1.15, 0]}>
              <boxGeometry args={[0.5, 0.7, 0.45]} />
              <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Glowing neon indicators */}
            <mesh position={[0, 1.35, 0.23]}>
              <boxGeometry args={[0.2, 0.04, 0.01]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
            </mesh>
            {/* Cup dispenser cavity */}
            <mesh position={[0, 0.95, 0.18]}>
              <boxGeometry args={[0.18, 0.24, 0.12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>
        );

      case 'server_terminal':
        return (
          <group>
            {/* Cabinet body */}
            <mesh castShadow position={[0, 1.0, 0]}>
              <boxGeometry args={[0.8, 2.0, 0.8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.15} />
            </mesh>
            {/* Blinking server cards */}
            <mesh position={[0, 1.4, 0.41]}>
              <boxGeometry args={[0.6, 0.1, 0.02]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 1.0, 0.41]}>
              <boxGeometry args={[0.6, 0.1, 0.02]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 0.6, 0.41]}>
              <boxGeometry args={[0.6, 0.1, 0.02]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.7} />
            </mesh>
          </group>
        );

      case 'book':
        return (
          <group>
            {/* Stack of three books */}
            <mesh castShadow position={[0, 0.03, 0]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[0.3, 0.06, 0.22]} />
              <meshStandardMaterial color="#ef4444" roughness={0.8} />
            </mesh>
            <mesh castShadow position={[0.02, 0.08, 0.01]} rotation={[0, -0.2, 0]}>
              <boxGeometry args={[0.28, 0.05, 0.21]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.8} />
            </mesh>
            <mesh castShadow position={[-0.01, 0.13, -0.01]} rotation={[0, 0.05, 0]}>
              <boxGeometry args={[0.26, 0.05, 0.2]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.8} />
            </mesh>
          </group>
        );

      case 'artwork':
        return (
          <group position={[0, 1.2, 0]}>
            {/* Plinth */}
            <mesh castShadow position={[0, -0.7, 0]}>
              <cylinderGeometry args={[0.3, 0.35, 1.0, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </mesh>
            {/* Floating abstract structure */}
            <mesh castShadow position={[0, 0.2, 0]} rotation={[0.4, 0.8, 0]}>
              <octahedronGeometry args={[0.4]} />
              <meshStandardMaterial color="#ec4899" metalness={0.9} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.2, 0]} scale={[1.1, 1.1, 1.1]}>
              <octahedronGeometry args={[0.42]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} wireframe />
            </mesh>
          </group>
        );

      case 'computer':
        return (
          <group>
            {/* Desk table */}
            <mesh castShadow position={[0, 0.38, 0]}>
              <boxGeometry args={[1.2, 0.76, 0.7]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
            {/* Screen base */}
            <mesh position={[0, 0.84, -0.15]}>
              <boxGeometry args={[0.1, 0.16, 0.1]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {/* Display screen */}
            <mesh castShadow position={[0, 1.1, -0.15]}>
              <boxGeometry args={[0.8, 0.44, 0.04]} />
              <meshStandardMaterial color="#1e293b" metalness={0.4} />
            </mesh>
            <mesh position={[0, 1.1, -0.12]}>
              <planeGeometry args={[0.76, 0.4]} />
              <meshBasicMaterial color="#020617" />
            </mesh>
            {/* Coding glow */}
            <mesh position={[0, 1.1, -0.11]}>
              <planeGeometry args={[0.7, 0.36]} />
              <meshBasicMaterial color="#0f172a" transparent opacity={0.3} />
            </mesh>
          </group>
        );

      case 'whiteboard':
        return (
          <group>
            {/* Stand legs */}
            <mesh position={[-0.9, 0.8, 0]}>
              <boxGeometry args={[0.06, 1.6, 0.4]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[0.9, 0.8, 0]}>
              <boxGeometry args={[0.06, 1.6, 0.4]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* Board sheet */}
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[1.7, 1.0, 0.04]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
          </group>
        );

      case 'map':
        return (
          <group>
            {/* Stand base */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 1.2]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* Map board tilted slightly */}
            <mesh position={[0, 1.25, 0]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.9, 0.6, 0.05]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            {/* Display face */}
            <mesh position={[0, 1.25, 0.03]} rotation={[0.4, 0, 0]}>
              <planeGeometry args={[0.84, 0.54]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.2} />
            </mesh>
          </group>
        );

      case 'elevator':
        return (
          <group>
            {/* Frame arch */}
            <mesh position={[-0.95, 1.25, 0]}>
              <boxGeometry args={[0.1, 2.5, 0.3]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            <mesh position={[0.95, 1.25, 0]}>
              <boxGeometry args={[0.1, 2.5, 0.3]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <boxGeometry args={[2.0, 0.1, 0.3]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            {/* Metal doors */}
            <mesh position={[0, 1.2, -0.05]}>
              <boxGeometry args={[1.8, 2.4, 0.02]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Up/Down buttons panel */}
            <mesh position={[1.1, 1.2, 0.08]}>
              <boxGeometry args={[0.08, 0.24, 0.02]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[1.1, 1.25, 0.1]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
          </group>
        );

      default:
        // Stand post for signs/posters
        return (
          <group>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.2]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.6, 0.4, 0.04]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group ref={meshRef} position={position} rotation={rotation} name={`prop_${type}_${id}`}>
      {renderMesh()}

      {/* 3D Billboard Prompt */}
      {isNear && (
        <Html distanceFactor={6} position={[0, type === 'server_terminal' || type === 'elevator' ? 2.5 : 1.7, 0]} center>
          <div className="flex flex-col items-center animate-fade-in pointer-events-none select-none">
            {/* Floating prompt box */}
            <div className="flex items-center gap-2 bg-slate-950/90 border border-[#00f0ff] px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] backdrop-blur-md">
              <span className="flex items-center justify-center bg-[#00f0ff] text-slate-950 font-black text-xs px-1.5 py-0.5 rounded border border-[#00f0ff]">
                E
              </span>
              <span className="text-white text-xs font-bold tracking-wide whitespace-nowrap">
                Interact with {name}
              </span>
            </div>
            {/* Description note */}
            {description && (
              <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1 bg-slate-950/60 px-2 py-0.5 rounded">
                {description}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export default InteractiveProp;
