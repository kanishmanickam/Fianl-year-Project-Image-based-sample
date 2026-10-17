import React from 'react';
import { Physics } from '@react-three/rapier';

interface PhysicsWorldProps {
  children: React.ReactNode;
  debug?: boolean;
}

export const PhysicsWorld: React.FC<PhysicsWorldProps> = ({ children, debug = false }) => {
  return (
    <Physics gravity={[0, -15, 0]} debug={debug}>
      {children}
    </Physics>
  );
};

export default PhysicsWorld;
