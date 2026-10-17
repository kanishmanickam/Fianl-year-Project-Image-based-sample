import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import useInput from '../hooks/useInput';
import useThirdPersonCamera from '../hooks/useThirdPersonCamera';
import { useAvatarStore } from './AvatarStore';
import audioManager from '../audio/AudioManager';

interface PlayerProps {
  initialPosition?: [number, number, number];
}

// Surface classification math
const getSurfaceType = (pos: THREE.Vector3): string => {
  // 1. Water check (near central Fountain at [0, 0, 0] or Garden Pool at [0, 0, 30])
  const distToFountain = pos.distanceTo(new THREE.Vector3(0, 0, 0));
  const distToGarden = pos.distanceTo(new THREE.Vector3(0, 0, 30));
  if (distToFountain < 5.5) return 'water';
  if (distToGarden < 4.5) return 'water';

  // 2. Indoor check (proximity to building centers)
  const buildings = [
    { name: 'Administration', coords: [0, 0, -30] },
    { name: 'CyberLab', coords: [30, 0, 5] },
    { name: 'Library', coords: [-30, 0, 0] },
    { name: 'InnovationLab', coords: [20, 0, 20] },
    { name: 'ArtStudio', coords: [-20, 0, -20] },
    { name: 'BotanicalGarden', coords: [0, 0, 30] },
    { name: 'Cafeteria', coords: [-20, 0, 20] },
    { name: 'StudentCenter', coords: [20, 0, -20] },
    { name: 'Dormitory', coords: [-10, 0, -35] },
    { name: 'VRLab', coords: [35, 0, -10] },
  ];
  for (const b of buildings) {
    const bPos = new THREE.Vector3(b.coords[0], 0, b.coords[2]);
    const distXZ = new THREE.Vector3(pos.x, 0, pos.z).distanceTo(bPos);
    if (distXZ < 8.0) {
      if (b.name === 'Library' || b.name === 'ArtStudio') return 'wood';
      if (b.name === 'BotanicalGarden') return 'grass';
      return 'tile';
    }
  }

  // 3. Path check (stone path running along standard road axes)
  const onPathX = Math.abs(pos.x) < 3.8;
  const onPathZ = Math.abs(pos.z) < 3.8;
  if (onPathX || onPathZ) return 'stone';

  // 4. Default surface
  return 'grass';
};

export const Player: React.FC<PlayerProps> = ({ initialPosition = [0, 1.5, 10] }) => {
  const rbRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);

  // Expose teleport for debug panel
  React.useEffect(() => {
    (window as any).teleportPlayer = (x: number, y: number, z: number) => {
      if (rbRef.current) {
        rbRef.current.setTranslation({ x, y, z }, true);
        rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    };
    return () => {
      delete (window as any).teleportPlayer;
    };
  }, []);
  
  // Ref for the nested animated group containing head, body, backpack, hair
  const animGroupRef = useRef<THREE.Group>(null);
  
  // Refs for procedural leg movement representation
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);

  const inputRef = useInput();
  const avatar = useAvatarStore();

  const [isSprinting, setIsSprinting] = useState(false);

  // Movement parameters
  const MOVE_SPEED = 5.2;
  const SPRINT_SPEED = 9.5;
  const JUMP_FORCE = 7.5;

  const isGrounded = useRef(true);
  const wasGrounded = useRef(true);

  // Procedural Animation Trackers
  const legCycle = useRef(0);
  const squash = useRef(0);
  const stretch = useRef(0);

  // Hook up orbit follow camera
  useThirdPersonCamera(meshRef, isSprinting);

  useFrame((state, delta) => {
    if (!rbRef.current || !meshRef.current || !animGroupRef.current) return;

    const keys = inputRef.current;
    const currentSpeed = keys.sprint ? SPRINT_SPEED : MOVE_SPEED;
    setIsSprinting(keys.sprint && (keys.forward || keys.backward || keys.left || keys.right));

    // 1. Direction Calculation
    const camDir = new THREE.Vector3();
    state.camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0));
    camRight.y = 0;
    camRight.normalize();

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.forward) moveDir.add(camDir);
    if (keys.backward) moveDir.add(camDir.clone().negate());
    if (keys.left) moveDir.add(camRight.clone().negate());
    if (keys.right) moveDir.add(camRight);

    // 2. Physics & Acceleration/Deceleration
    const currentVelocity = rbRef.current.linvel();
    isGrounded.current = Math.abs(currentVelocity.y) < 0.05;

    // Check Landing squash impact trigger
    if (isGrounded.current && !wasGrounded.current) {
      squash.current = -0.25; // Compact down on impact
      audioManager.playSFX('click');
    }
    wasGrounded.current = isGrounded.current;

    let targetVelX = 0;
    let targetVelZ = 0;

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      
      // Target velocities
      targetVelX = moveDir.x * currentSpeed;
      targetVelZ = moveDir.z * currentSpeed;

      // Rotate player mesh smoothly to face movement direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      const currentRotation = meshRef.current.rotation.y;
      
      let diff = targetAngle - currentRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      meshRef.current.rotation.y += diff * delta * 12;
    }

    // Apply linear lerp for smooth acceleration and deceleration
    const accelSpeed = isGrounded.current ? 9.5 : 3.5; // Less air control
    const newVelX = THREE.MathUtils.lerp(currentVelocity.x, targetVelX, delta * accelSpeed);
    const newVelZ = THREE.MathUtils.lerp(currentVelocity.z, targetVelZ, delta * accelSpeed);
    let newVelY = currentVelocity.y;

    // Jump handling
    if (keys.jump && isGrounded.current) {
      newVelY = JUMP_FORCE;
      isGrounded.current = false;
      keys.jump = false;
      stretch.current = 0.22; // Stretch upward on jump
    }

    rbRef.current.setLinvel({ x: newVelX, y: newVelY, z: newVelZ }, true);

    // 3. Procedural Animation Calculations
    const horizSpeed = Math.sqrt(newVelX ** 2 + newVelZ ** 2);
    const isMoving = horizSpeed > 0.25 && isGrounded.current;

    // Increment leg cycle based on real-time speed to avoid sliding
    if (isMoving) {
      const lastVal = Math.sin(legCycle.current);
      legCycle.current += delta * horizSpeed * 2.3;
      const newVal = Math.sin(legCycle.current);

      // Trigger footstep sound at maximum leg swings (crossing zero point of sine wave)
      if ((lastVal >= 0 && newVal < 0) || (lastVal <= 0 && newVal > 0)) {
        const playerPos = new THREE.Vector3();
        meshRef.current.getWorldPosition(playerPos);
        const surface = getSurfaceType(playerPos);
        audioManager.setReverbActive(surface === 'tile' || surface === 'wood');
        audioManager.playSFX(`footstep_${surface}`);
      }
    } else {
      // Return leg cycle slowly to rest
      legCycle.current = THREE.MathUtils.lerp(legCycle.current, 0, delta * 8);
    }

    // Decay squash and stretch factors
    squash.current = THREE.MathUtils.lerp(squash.current, 0, delta * 10);
    stretch.current = THREE.MathUtils.lerp(stretch.current, 0, delta * 8);

    // Apply breathing / bobbing
    const time = state.clock.getElapsedTime();
    const bobHeight = isMoving 
      ? Math.abs(Math.sin(legCycle.current)) * 0.08 
      : Math.sin(time * 2.2) * 0.035;

    // Body Tilt
    const targetTilt = isMoving ? (keys.sprint ? 0.22 : 0.12) : 0;
    animGroupRef.current.rotation.x = THREE.MathUtils.lerp(animGroupRef.current.rotation.x, targetTilt, delta * 8);

    // Leg swinging rotations
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(legCycle.current) * 0.6;
      rightLegRef.current.rotation.x = -Math.sin(legCycle.current) * 0.6;
      
      leftLegRef.current.position.y = -0.3 + Math.max(0, -Math.cos(legCycle.current)) * 0.05;
      rightLegRef.current.position.y = -0.3 + Math.max(0, Math.cos(legCycle.current)) * 0.05;
    }

    // Apply squash & stretch scale modifications to the body container
    const finalScaleY = 1.0 + squash.current + stretch.current;
    const finalScaleXZ = 1.0 - (squash.current + stretch.current) * 0.5;
    animGroupRef.current.scale.set(finalScaleXZ, finalScaleY, finalScaleXZ);
    animGroupRef.current.position.y = 0.8 + bobHeight;
  });

  return (
    <RigidBody
      ref={rbRef}
      colliders="hull"
      enabledRotations={[false, false, false]}
      position={initialPosition}
      type="dynamic"
      name="player"
    >
      <group ref={meshRef}>
        {/* Animated Visual Group wrapper */}
        <group ref={animGroupRef}>
          {/* Main Hoodie Torso */}
          <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
            <capsuleGeometry args={[0.38, 0.6, 6, 12]} />
            <meshStandardMaterial color={avatar.clothingColor} roughness={0.4} />
          </mesh>

          {/* Skin Head */}
          <mesh castShadow position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color={avatar.skinColor} roughness={0.6} />
          </mesh>

          {/* Visor / Eyes (Cyber theme style) */}
          <mesh position={[0, 0.64, 0.17]}>
            <boxGeometry args={[0.35, 0.09, 0.1]} />
            <meshStandardMaterial color={avatar.eyeColor} emissive={avatar.eyeColor} emissiveIntensity={0.6} />
          </mesh>

          {/* Custom Hairstyles */}
          {avatar.hairStyle === 'spiky' && (
            <group position={[0, 0.8, -0.05]}>
              <mesh position={[-0.08, 0, 0.05]} rotation={[0.2, 0, 0.2]}>
                <coneGeometry args={[0.07, 0.2, 4]} />
                <meshStandardMaterial color={avatar.hairColor} roughness={0.7} />
              </mesh>
              <mesh position={[0.08, 0, 0.05]} rotation={[0.2, 0, -0.2]}>
                <coneGeometry args={[0.07, 0.2, 4]} />
                <meshStandardMaterial color={avatar.hairColor} roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.06, 0]} rotation={[0, 0, 0]}>
                <coneGeometry args={[0.08, 0.24, 4]} />
                <meshStandardMaterial color={avatar.hairColor} roughness={0.7} />
              </mesh>
              <mesh position={[0, 0, -0.08]} rotation={[-0.2, 0, 0]}>
                <coneGeometry args={[0.08, 0.2, 4]} />
                <meshStandardMaterial color={avatar.hairColor} roughness={0.7} />
              </mesh>
            </group>
          )}

          {avatar.hairStyle === 'long' && (
            <mesh position={[0, 0.44, -0.15]}>
              <boxGeometry args={[0.28, 0.45, 0.1]} />
              <meshStandardMaterial color={avatar.hairColor} roughness={0.7} />
            </mesh>
          )}

          {avatar.hairStyle === 'bun' && (
            <mesh position={[0, 0.82, -0.1]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={avatar.hairColor} roughness={0.7} />
            </mesh>
          )}

          {/* Backpack styles */}
          {avatar.backpack === 'classic' && (
            <mesh position={[0, 0.1, -0.24]}>
              <boxGeometry args={[0.34, 0.42, 0.16]} />
              <meshStandardMaterial color="#475569" roughness={0.6} />
            </mesh>
          )}

          {avatar.backpack === 'cyberpack' && (
            <group position={[0, 0.1, -0.24]}>
              {/* Main glowing container */}
              <mesh>
                <boxGeometry args={[0.32, 0.4, 0.15]} />
                <meshStandardMaterial color="#1e293b" roughness={0.5} />
              </mesh>
              {/* Neon bar */}
              <mesh position={[0, 0, -0.08]}>
                <boxGeometry args={[0.08, 0.3, 0.02]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
              </mesh>
              {/* Antenna */}
              <mesh position={[0.1, 0.24, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.16]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
            </group>
          )}
        </group>

        {/* Procedural Legs (Swinging relative to base player mesh) */}
        <mesh ref={leftLegRef} castShadow position={[-0.15, -0.3, 0]}>
          <boxGeometry args={[0.13, 0.45, 0.13]} />
          <meshStandardMaterial color={avatar.clothingColor} roughness={0.5} />
        </mesh>
        <mesh ref={rightLegRef} castShadow position={[0.15, -0.3, 0]}>
          <boxGeometry args={[0.13, 0.45, 0.13]} />
          <meshStandardMaterial color={avatar.clothingColor} roughness={0.5} />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default Player;
