import React, { useMemo } from 'react';
import * as THREE from 'three';

export const CABLE_CURVE_POINTS = [
  new THREE.Vector3(0.92, 0.95, 1.8),  // Station outlet
  new THREE.Vector3(0.95, 0.45, 1.5),  // Droop
  new THREE.Vector3(0.92, 0.25, 1.2),  // Ground contour
  new THREE.Vector3(0.90, 0.40, 0.95), // Rising up to car
  new THREE.Vector3(0.90, 0.52, 0.81)  // Car socket
];

export const ChargingCable = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(CABLE_CURVE_POINTS);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, 0.025, 8, false);
  }, [curve]);

  return (
    <group>
      {/* Heavy-duty flexible charging cable */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#161A18"
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Gun Connector Head plugged into EV */}
      <group position={[0.90, 0.52, 0.85]} rotation={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.05, 0.12, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#0A2A20" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshStandardMaterial color="#3FA66B" emissive="#3FA66B" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
};
