import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraConfig {
  minDistance?: number;
  maxDistance?: number;
  zoomSpeed?: number;
  rotationSpeed?: number;
  lookAtOffset?: THREE.Vector3;
}

export const useThirdPersonCamera = (
  targetRef: React.RefObject<THREE.Object3D | null>,
  isSprinting: boolean = false,
  config: CameraConfig = {}
) => {
  const {
    minDistance = 2.5,
    maxDistance = 12,
    zoomSpeed = 0.6,
    rotationSpeed = 0.0025,
    lookAtOffset = new THREE.Vector3(0, 1.35, 0),
  } = config;

  const { camera, gl } = useThree();

  // Mouse orbit controls references
  const theta = useRef<number>(Math.PI / 4); // Yaw rotation
  const phi = useRef<number>(Math.PI / 3);   // Pitch rotation
  const distance = useRef<number>(6);        // Interpolated camera distance
  const targetDistance = useRef<number>(6);  // Desired camera distance (zoom target)

  // Impact camera shake tracker
  const shakeIntensity = useRef<number>(0);

  // Drag interaction tracking
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      if (e.button === 0) {
        try {
          gl.domElement.requestPointerLock();
        } catch {}
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const isPointerLocked = document.pointerLockElement === gl.domElement;
      if (!isDragging.current && !isPointerLocked) return;

      const sens = isPointerLocked ? rotationSpeed * 0.85 : rotationSpeed;
      theta.current -= e.movementX * sens;
      phi.current = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.05, phi.current - e.movementY * sens)
      );
    };

    const handleWheel = (e: WheelEvent) => {
      targetDistance.current = Math.max(
        minDistance,
        Math.min(maxDistance, targetDistance.current + e.deltaY * 0.01 * zoomSpeed)
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Key R to reset camera orbit angle
      if (e.key.toLowerCase() === 'r') {
        theta.current = Math.PI / 4;
        phi.current = Math.PI / 3;
        targetDistance.current = 6;
      }
    };

    const domElement = gl.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('wheel', handleWheel);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gl, minDistance, maxDistance, zoomSpeed, rotationSpeed]);

  // Raycaster initialized once
  const raycasterRef = useRef(new THREE.Raycaster());

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    // 1. Get current target position
    const targetPos = new THREE.Vector3();
    targetRef.current.getWorldPosition(targetPos);
    const lookTarget = targetPos.clone().add(lookAtOffset);

    // 2. Dynamic FOV adjustments
    const currentCamera = camera as THREE.PerspectiveCamera;
    if (currentCamera.isPerspectiveCamera) {
      const targetFov = isSprinting ? 64 : 50;
      currentCamera.fov = THREE.MathUtils.lerp(currentCamera.fov, targetFov, delta * 5);
      currentCamera.updateProjectionMatrix();
    }

    // 3. Smoothly lerp distance zoom
    distance.current = THREE.MathUtils.lerp(distance.current, targetDistance.current, delta * 6);

    // 4. Compute camera offset position using Spherical coordinates
    const offset = new THREE.Vector3();
    offset.x = distance.current * Math.sin(phi.current) * Math.sin(theta.current);
    offset.y = distance.current * Math.cos(phi.current);
    offset.z = distance.current * Math.sin(phi.current) * Math.cos(theta.current);

    // 5. Advanced Raycast Camera Collision with Walls & Buildings
    const collidableObjects: THREE.Object3D[] = [];
    state.scene.traverse((child) => {
      const meshChild = child as THREE.Mesh;
      if (
        meshChild.isMesh &&
        meshChild.name !== 'player' &&
        meshChild.parent?.name !== 'player' &&
        !meshChild.name.startsWith('npc') &&
        !meshChild.name.includes('Particle') &&
        !meshChild.name.includes('Foliage')
      ) {
        collidableObjects.push(meshChild);
      }
    });

    const rayDir = offset.clone().normalize();
    raycasterRef.current.set(lookTarget, rayDir);
    
    // Check collisions up to current camera distance
    const intersects = raycasterRef.current.intersectObjects(collidableObjects, true);
    let finalDistance = distance.current;

    if (intersects.length > 0) {
      const closest = intersects[0];
      if (closest.distance < distance.current) {
        // Zoom camera in closer to avoid clipping inside walls, leaving a 0.25m cushion
        finalDistance = Math.max(0.8, closest.distance - 0.25);
      }
    }

    // Recompute camera offset using final collision distance
    const finalOffset = rayDir.multiplyScalar(finalDistance);

    // 6. Impact Camera Shake (derived from player squash scale)
    const playerVisualGroup = targetRef.current.children[0];
    if (playerVisualGroup) {
      const scaleY = playerVisualGroup.scale.y;
      if (scaleY < 0.98) {
        // Trigger shake proportional to physical squash delta
        shakeIntensity.current = Math.max(shakeIntensity.current, (1.0 - scaleY) * 0.45);
      }
    }

    // Decay shake intensity
    shakeIntensity.current = THREE.MathUtils.lerp(shakeIntensity.current, 0, delta * 6);

    // Apply shake offsets
    if (shakeIntensity.current > 0.002) {
      const shakeOffset = new THREE.Vector3(
        (Math.random() - 0.5) * shakeIntensity.current,
        (Math.random() - 0.5) * shakeIntensity.current,
        (Math.random() - 0.5) * shakeIntensity.current
      );
      finalOffset.add(shakeOffset);
    }

    const desiredCameraPos = lookTarget.clone().add(finalOffset);

    // Camera follow lerp (reduces physical stutter/jitter)
    camera.position.lerp(desiredCameraPos, delta * 8.5);

    // Look at target position with offset
    camera.lookAt(lookTarget);
  });

  return {
    cameraYaw: theta,
  };
};

export default useThirdPersonCamera;
