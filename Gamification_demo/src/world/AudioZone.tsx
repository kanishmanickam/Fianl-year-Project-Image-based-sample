import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import audioManager from '../audio/AudioManager';

interface AudioZoneProps {
  name: string;
  position: [number, number, number];
  size: [number, number, number]; // Bounding box bounds [width, height, depth]
  musicTrack: string;
  ambientTrack: string;
}

export const AudioZone: React.FC<AudioZoneProps> = ({
  name,
  position,
  size,
  musicTrack,
  ambientTrack,
}) => {
  const zonePos = new THREE.Vector3(...position);
  const halfSize = new THREE.Vector3(size[0] / 2, size[1] / 2, size[2] / 2);
  const playerRef = useRef<THREE.Object3D | null>(null);

  // Box helper to represent the boundaries (invisible, but can be debugged)
  const isInsideRef = useRef(false);

  useFrame((state) => {
    // 1. Find player reference if not cached
    if (!playerRef.current) {
      playerRef.current = state.scene.getObjectByName('player') || null;
    }

    if (playerRef.current) {
      const playerPos = new THREE.Vector3();
      playerRef.current.getWorldPosition(playerPos);

      // 2. Check if player coordinates are inside the bounding box
      const minX = zonePos.x - halfSize.x;
      const maxX = zonePos.x + halfSize.x;
      const minY = zonePos.y - halfSize.y;
      const maxY = zonePos.y + halfSize.y;
      const minZ = zonePos.z - halfSize.z;
      const maxZ = zonePos.z + halfSize.z;

      const inside =
        playerPos.x >= minX &&
        playerPos.x <= maxX &&
        playerPos.y >= minY &&
        playerPos.y <= maxY &&
        playerPos.y >= minZ &&
        playerPos.y <= maxZ;

      if (inside && !isInsideRef.current) {
        // Player entered the audio zone
        isInsideRef.current = true;
        console.log(`[AudioZone] Entered zone: ${name}`);
        audioManager.playMusic(musicTrack);
        audioManager.playAmbient(ambientTrack);
      } else if (!inside && isInsideRef.current) {
        // Player exited the audio zone
        isInsideRef.current = false;
      }
    }
  });

  return (
    <mesh position={position} visible={false}>
      <boxGeometry args={size} />
      <meshBasicMaterial color="#00ff00" wireframe />
    </mesh>
  );
};

export default AudioZone;
