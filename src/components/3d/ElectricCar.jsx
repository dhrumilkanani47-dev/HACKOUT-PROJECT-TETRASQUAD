import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ElectricCar = ({ position = [0, 0, 0], isCharging = true }) => {
  const chargeGlowRef = useRef();

  useFrame(({ clock }) => {
    if (chargeGlowRef.current && isCharging) {
      const pulse = 0.5 + 0.5 * Math.sin(clock.getElapsedTime() * 4);
      chargeGlowRef.current.material.emissiveIntensity = 0.8 + pulse * 1.2;
    }
  });

  return (
    <group position={position}>
      {/* Main Car Body - Lower Chassis */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.45, 1.6]} />
        <meshStandardMaterial
          color="#0F3D2E"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Car Body - Aerodynamic Hood & Front */}
      <mesh position={[1.1, 0.48, 0]} castShadow>
        <boxGeometry args={[1.0, 0.32, 1.54]} />
        <meshStandardMaterial
          color="#155C41"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Front Nose Curve */}
      <mesh position={[1.55, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.25, 1.48]} />
        <meshStandardMaterial color="#0A2A20" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Front LED Lightbar (Futuristic EV Signature) */}
      <mesh position={[1.66, 0.44, 0]}>
        <boxGeometry args={[0.04, 0.06, 1.4]} />
        <meshStandardMaterial
          color="#76E4A2"
          emissive="#3FA66B"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Cabin / Roof (Dark Tinted Glass Bubble) */}
      <mesh position={[-0.1, 0.88, 0]} castShadow>
        <boxGeometry args={[1.7, 0.5, 1.3]} />
        <meshStandardMaterial
          color="#0B1612"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Roof Panel */}
      <mesh position={[-0.1, 1.14, 0]} castShadow>
        <boxGeometry args={[1.5, 0.04, 1.2]} />
        <meshStandardMaterial
          color="#0F3D2E"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Rear Lightbar */}
      <mesh position={[-1.61, 0.52, 0]}>
        <boxGeometry args={[0.04, 0.08, 1.4]} />
        <meshStandardMaterial
          color="#E8A33D"
          emissive="#E8A33D"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Side Charging Port Door (Side near charging station) */}
      <group position={[0.9, 0.52, 0.81]}>
        {/* Port Socket */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#16201B" />
        </mesh>
        {/* Pulsing Green Charging Indicator Ring */}
        <mesh ref={chargeGlowRef} position={[0, 0, 0.01]}>
          <ringGeometry args={[0.06, 0.09, 24]} />
          <meshStandardMaterial
            color="#3FA66B"
            emissive="#3FA66B"
            emissiveIntensity={1.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Stationary Wheels (Left Front, Left Rear, Right Front, Right Rear) */}
      {/* Front Left */}
      <group position={[0.95, 0.22, 0.78]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.18, 24]} />
          <meshStandardMaterial color="#161817" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 12]} />
          <meshStandardMaterial color="#3FA66B" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Left */}
      <group position={[-0.95, 0.22, 0.78]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.18, 24]} />
          <meshStandardMaterial color="#161817" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 12]} />
          <meshStandardMaterial color="#3FA66B" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[0.95, 0.22, -0.78]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.18, 24]} />
          <meshStandardMaterial color="#161817" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 12]} />
          <meshStandardMaterial color="#3FA66B" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Right */}
      <group position={[-0.95, 0.22, -0.78]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.18, 24]} />
          <meshStandardMaterial color="#161817" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 12]} />
          <meshStandardMaterial color="#3FA66B" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Subtle Underglow / Ambient Ground Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 2.0]} />
        <meshBasicMaterial color="#030805" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};
