import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const ChargingStation = ({ position = [1.2, 0, 1.8] }) => {
  const ledRef = useRef();

  useFrame(({ clock }) => {
    if (ledRef.current) {
      const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 3);
      ledRef.current.material.emissiveIntensity = 1.0 + pulse * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Station Plinth / Foundation */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.1, 0.7]} />
        <meshStandardMaterial color="#0A2A20" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Main Charger Column */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.55, 1.9, 0.45]} />
        <meshStandardMaterial color="#F6F4EC" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Forest Green Front Accent Panel */}
      <mesh position={[0, 1.1, 0.23]}>
        <boxGeometry args={[0.42, 1.6, 0.02]} />
        <meshStandardMaterial color="#0F3D2E" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Glowing Status LED Screen */}
      <mesh position={[0, 1.45, 0.245]}>
        <boxGeometry args={[0.34, 0.42, 0.01]} />
        <meshStandardMaterial
          color="#051812"
          emissive="#155C41"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Active Charging Pulse Indicator on Screen */}
      <mesh ref={ledRef} position={[0, 1.52, 0.252]}>
        <ringGeometry args={[0.04, 0.07, 16]} />
        <meshStandardMaterial
          color="#3FA66B"
          emissive="#3FA66B"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Cable Outlet Socket on Side */}
      <mesh position={[-0.28, 0.95, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#16201B" />
      </mesh>

      {/* Top Beacon / Network Logo Cap */}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.45]} />
        <meshStandardMaterial
          color="#3FA66B"
          emissive="#3FA66B"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
};
