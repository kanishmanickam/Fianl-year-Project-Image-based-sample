import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from './WeatherSystem';

interface ParticleSystemProps {
  timeOfDay?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ timeOfDay = 9.0 }) => {
  const weather = useWeatherStore((state) => state.currentWeather);

  // References to particle systems
  const rainRef = useRef<THREE.Points>(null);
  const leavesRef = useRef<THREE.Points>(null);
  const firefliesRef = useRef<THREE.Points>(null);

  const RAIN_COUNT = 1500;
  const LEAF_COUNT = 250;
  const FIREFLY_COUNT = 100;

  // 1. Generate Rain Buffers
  const rainPositions = useMemo(() => {
    const arr = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50; // X
      arr[i * 3 + 1] = Math.random() * 25;    // Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50; // Z
    }
    return arr;
  }, []);

  // 2. Generate Leaves Buffers
  const leafPositions = useMemo(() => {
    const arr = new Float32Array(LEAF_COUNT * 3);
    for (let i = 0; i < LEAF_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  // 3. Generate Firefly Buffers
  const fireflyPositions = useMemo(() => {
    const arr = new Float32Array(FIREFLY_COUNT * 3);
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 35;
      arr[i * 3 + 1] = Math.random() * 4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    return arr;
  }, []);

  // Is it night?
  const isNight = timeOfDay < 6.0 || timeOfDay > 19.5;

  useFrame((state, delta) => {
    // A. Animate Rain
    if (rainRef.current && (weather === 'light_rain' || weather === 'heavy_rain')) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      const speed = weather === 'heavy_rain' ? 30 : 15;

      for (let i = 0; i < RAIN_COUNT; i++) {
        // Fall down
        positions[i * 3 + 1] -= speed * delta;
        // Drift slightly by wind
        positions[i * 3] += 1.5 * delta;

        // Reset if hit ground
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3] = (Math.random() - 0.5) * 50;
          positions[i * 3 + 1] = 20 + Math.random() * 5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // B. Animate Leaves
    if (leavesRef.current && (weather === 'windy' || weather === 'sunny')) {
      const positions = leavesRef.current.geometry.attributes.position.array as Float32Array;
      const fallSpeed = 1.0;
      const driftSpeed = weather === 'windy' ? 4.5 : 1.2;

      for (let i = 0; i < LEAF_COUNT; i++) {
        positions[i * 3 + 1] -= fallSpeed * delta;
        positions[i * 3] += driftSpeed * delta * (1.0 + Math.sin(state.clock.getElapsedTime() + i) * 0.2);
        positions[i * 3 + 2] += Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.5 * delta;

        if (positions[i * 3 + 1] < 0) {
          positions[i * 3] = (Math.random() - 0.5) * 40;
          positions[i * 3 + 1] = 12 + Math.random() * 4;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      leavesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // C. Animate Fireflies
    if (firefliesRef.current && isNight) {
      const positions = firefliesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < FIREFLY_COUNT; i++) {
        // Rise and sway slowly
        positions[i * 3 + 1] += Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.15 * delta;
        positions[i * 3] += Math.cos(state.clock.getElapsedTime() * 0.8 + i) * 0.1 * delta;
        positions[i * 3 + 2] += Math.sin(state.clock.getElapsedTime() * 0.4 + i) * 0.1 * delta;

        if (positions[i * 3 + 1] < 0 || positions[i * 3 + 1] > 4) {
          positions[i * 3 + 1] = Math.random() * 3.5;
        }
      }
      firefliesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Rain Particles */}
      {(weather === 'light_rain' || weather === 'heavy_rain') && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[rainPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#a5f3fc"
            size={0.06}
            transparent
            opacity={0.4}
            sizeAttenuation
          />
        </points>
      )}

      {/* 2. Autumn Leaves Particles */}
      {(weather === 'windy' || weather === 'sunny') && (
        <points ref={leavesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[leafPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#ea580c" // amber/orange
            size={0.12}
            transparent
            opacity={0.65}
            sizeAttenuation
          />
        </points>
      )}

      {/* 3. Night Fireflies */}
      {isNight && (
        <points ref={firefliesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[fireflyPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#39ff14" // neon green
            size={0.09}
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};

export default ParticleSystem;
