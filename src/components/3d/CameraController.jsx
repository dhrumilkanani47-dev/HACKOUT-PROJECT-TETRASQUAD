import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const CameraController = ({ isReducedMotion = false }) => {
  useFrame(({ clock, camera }) => {
    if (isReducedMotion) return;
    const t = clock.getElapsedTime() * 0.3;
    // Very subtle breathing camera movement
    camera.position.x = 4.2 + Math.sin(t) * 0.15;
    camera.position.y = 2.4 + Math.sin(t * 0.8) * 0.08;
    camera.position.z = 4.6 + Math.cos(t) * 0.15;
    camera.lookAt(0, 0.4, 0);
  });

  return null;
};
