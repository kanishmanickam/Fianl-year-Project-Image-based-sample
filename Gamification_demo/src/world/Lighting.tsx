import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from './WeatherSystem';

interface LightingProps {
  timeOfDay?: number;
  autoCycle?: boolean;
}

export const Lighting: React.FC<LightingProps> = ({ timeOfDay = 8.0, autoCycle = true }) => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const starsRef = useRef<THREE.Points>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef<number>(timeOfDay);

  const weather = useWeatherStore((state) => state.currentWeather);

  // Base colors
  const ambientColors = {
    morning: new THREE.Color('#4a4f6e'),
    noon: new THREE.Color('#90b0e0'),
    evening: new THREE.Color('#583d72'),
    night: new THREE.Color('#0a0d24'),
  };

  const sunColors = {
    morning: new THREE.Color('#ffc18e'),
    noon: new THREE.Color('#ffffff'),
    evening: new THREE.Color('#f05941'),
    night: new THREE.Color('#1e293b'),
  };

  // Generate star field vertices
  const starsPositions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const radius = 45;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      // Spherical to Cartesian
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = Math.abs(radius * Math.sin(phi) * Math.sin(theta)) + 10; // keep above ground
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (autoCycle) {
      // 1 hour every 12 real seconds
      timeRef.current = (timeRef.current + (delta * 0.083)) % 24;
    }

    const t = timeRef.current;
    let mixFactor = 0;

    let currentAmbient = new THREE.Color();
    let currentSun = new THREE.Color();
    let sunIntensity = 1.0;
    const sunPos = new THREE.Vector3();

    // Determine Day/Night Cycle factors
    if (t >= 5 && t < 11) {
      mixFactor = (t - 5) / 6;
      currentAmbient.copy(ambientColors.night).lerp(ambientColors.morning, mixFactor);
      currentSun.copy(sunColors.night).lerp(sunColors.morning, mixFactor);
      sunIntensity = THREE.MathUtils.lerp(0.1, 1.2, mixFactor);
      sunPos.set(-25 + mixFactor * 25, 4 + mixFactor * 20, 0);
    } else if (t >= 11 && t < 17) {
      mixFactor = (t - 11) / 6;
      currentAmbient.copy(ambientColors.morning).lerp(ambientColors.noon, mixFactor);
      currentSun.copy(sunColors.morning).lerp(sunColors.noon, mixFactor);
      sunIntensity = 1.4;
      sunPos.set(0 + mixFactor * 25, 24 - mixFactor * 6, 0);
    } else if (t >= 17 && t < 21) {
      mixFactor = (t - 17) / 4;
      currentAmbient.copy(ambientColors.noon).lerp(ambientColors.evening, mixFactor);
      currentSun.copy(sunColors.noon).lerp(sunColors.evening, mixFactor);
      sunIntensity = THREE.MathUtils.lerp(1.4, 0.4, mixFactor);
      sunPos.set(25 + mixFactor * 20, 18 - mixFactor * 14, 0);
    } else {
      if (t >= 21) {
        mixFactor = (t - 21) / 8;
      } else {
        mixFactor = (t + 3) / 8;
      }
      currentAmbient.copy(ambientColors.evening).lerp(ambientColors.night, mixFactor);
      currentSun.copy(sunColors.evening).lerp(sunColors.night, mixFactor);
      sunIntensity = 0.15;
      sunPos.set(-30, -20, 0);
    }

    // WEATHER INFLUENCE: Reduce sun/ambient light on rain/clouds
    if (weather === 'cloudy') {
      sunIntensity *= 0.45;
      currentAmbient.lerp(new THREE.Color('#555555'), 0.3);
    } else if (weather === 'light_rain') {
      sunIntensity *= 0.25;
      currentAmbient.lerp(new THREE.Color('#333845'), 0.5);
    } else if (weather === 'heavy_rain') {
      sunIntensity *= 0.05;
      currentAmbient.lerp(new THREE.Color('#1a1d26'), 0.7);
    }

    // Apply adjustments to sun light
    if (sunLightRef.current) {
      sunLightRef.current.color.copy(currentSun);
      sunLightRef.current.intensity = sunIntensity;
      sunLightRef.current.position.copy(sunPos);
    }

    // Is it night time?
    const isNightVal = t < 5.0 || t > 20.0;
    
    // Rotate stars
    if (starsRef.current) {
      starsRef.current.visible = isNightVal && weather !== 'heavy_rain';
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }

    // Position Moon opposite to Sun
    if (moonRef.current) {
      moonRef.current.visible = isNightVal;
      if (isNightVal) {
        // Moon rises in the East when Sun goes down
        const moonPos = new THREE.Vector3(-30, 20, 10);
        moonRef.current.position.copy(moonPos);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        ref={sunLightRef}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight
        args={['#ffffff', '#222222', 0.15]}
        position={[0, 60, 0]}
      />

      {/* Night Sky Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starsPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      {/* Moon Mesh Sphere */}
      <mesh ref={moonRef} position={[0, -50, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>
    </>
  );
};

export default Lighting;
