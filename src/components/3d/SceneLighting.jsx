import React from 'react';

export const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.65} color="#E4F1E8" />
      <directionalLight
        position={[6, 10, 8]}
        intensity={1.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-6, 8, -6]}
        intensity={0.4}
        color="#3FA66B"
      />
      <pointLight
        position={[1.6, 1.2, 0]}
        intensity={1.8}
        distance={4}
        color="#3FA66B"
      />
      <pointLight
        position={[-1.2, 1.8, 0.5]}
        intensity={1.2}
        distance={3}
        color="#3FA66B"
      />
    </>
  );
};
