import React, { useEffect } from 'react';
import { create } from 'zustand';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import audioManager from '../audio/AudioManager';

export type WeatherType = 'sunny' | 'cloudy' | 'light_rain' | 'heavy_rain' | 'windy';

interface WeatherState {
  currentWeather: WeatherType;
  puddleWetness: number; // 0.0 (dry) to 1.0 (wet)
  windDirection: [number, number]; // 2D vector [x, z]
  setWeather: (weather: WeatherType) => void;
  updateWetness: (delta: number) => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  currentWeather: 'sunny',
  puddleWetness: 0.0,
  windDirection: [1.0, 0.5],

  setWeather: (weather) => {
    set({ currentWeather: weather });
    console.log(`[WeatherSystem] Weather changed to: ${weather}`);
    
    // Play ambient loops based on weather
    if (weather === 'light_rain') {
      audioManager.playAmbient('light_rain_loop');
    } else if (weather === 'heavy_rain') {
      audioManager.playAmbient('heavy_rain_loop');
    } else if (weather === 'windy') {
      audioManager.playAmbient('windy_loop');
    } else {
      audioManager.playAmbient('birds_wind_ambient');
    }
  },

  updateWetness: (delta) => {
    const { currentWeather, puddleWetness } = get();
    let targetWetness = puddleWetness;

    if (currentWeather === 'heavy_rain') {
      targetWetness = Math.min(1.0, puddleWetness + delta * 0.1);
    } else if (currentWeather === 'light_rain') {
      targetWetness = Math.min(0.6, puddleWetness + delta * 0.05);
    } else {
      // Dry up slowly
      targetWetness = Math.max(0.0, puddleWetness - delta * 0.04);
    }

    if (targetWetness !== puddleWetness) {
      set({ puddleWetness: parseFloat(targetWetness.toFixed(3)) });
    }
  },
}));

export const WeatherSystem: React.FC = () => {
  const { scene } = useThree();
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const updateWetness = useWeatherStore((state) => state.updateWetness);

  // 1. Update wetness factor on frame updates
  useEffect(() => {
    let lastTime = performance.now();
    let frameId = 0;

    const tick = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      updateWetness(delta);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [updateWetness]);

  // 2. Dynamically update scene fog based on weather conditions
  useEffect(() => {
    let fogColor = '#80a0d0';
    let fogNear = 35;
    let fogFar = 75;

    switch (currentWeather) {
      case 'sunny':
        fogColor = '#a5f3fc'; // light cyan
        fogNear = 40;
        fogFar = 90;
        break;
      case 'cloudy':
        fogColor = '#94a3b8'; // gray
        fogNear = 25;
        fogFar = 65;
        break;
      case 'light_rain':
        fogColor = '#475569'; // darker slate
        fogNear = 18;
        fogFar = 50;
        break;
      case 'heavy_rain':
        fogColor = '#1e293b'; // very dark slate
        fogNear = 10;
        fogFar = 32;
        break;
      case 'windy':
        fogColor = '#cbd5e1'; // light foggy gray
        fogNear = 30;
        fogFar = 70;
        break;
    }

    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  }, [scene, currentWeather]);

  // 3. Random lightning/thunder trigger during heavy rain
  useEffect(() => {
    if (currentWeather !== 'heavy_rain') return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // Trigger thunder audio play
        audioManager.playSFX('thunder');
        
        // Brief white flash of ambient light
        const originalBg = scene.background;
        scene.background = new THREE.Color('#ffffff');
        setTimeout(() => {
          scene.background = originalBg;
        }, 80);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentWeather, scene]);

  return null; // Side-effect coordinator only
};

export default WeatherSystem;
