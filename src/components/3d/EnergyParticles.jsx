import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CABLE_CURVE_POINTS } from './ChargingCable';

export const EnergyParticles = ({ count = 28, isReducedMotion = false }) => {
  const pointsRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(CABLE_CURVE_POINTS);
  }, []);

  // Initialize particle offsets along the spline [0, 1]
  const particleProgress = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = i / count;
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p = curve.getPoint(particleProgress[i]);
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    }
    return pos;
  }, [count, curve, particleProgress]);

  useFrame((_, delta) => {
    if (isReducedMotion || !pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const speed = delta * 0.45;

    for (let i = 0; i < count; i++) {
      particleProgress[i] = (particleProgress[i] + speed) % 1.0;
      const point = curve.getPoint(particleProgress[i]);
      posAttr.setXYZ(i, point.x, point.y, point.z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#76E4A2"
        size={0.075}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
