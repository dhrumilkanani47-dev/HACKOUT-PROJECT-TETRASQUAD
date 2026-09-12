import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneLighting } from './SceneLighting';
import { ElectricCar } from './ElectricCar';
import { ChargingStation } from './ChargingStation';
import { ChargingCable } from './ChargingCable';
import { EnergyParticles } from './EnergyParticles';
import { CameraController } from './CameraController';
import { Zap, ShieldCheck, Sun } from 'lucide-react';

const FloorPedestal = () => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Sleek studio circular charging pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.2, 48]} />
        <meshStandardMaterial
          color="#E4EFE7"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative concentric glowing green line on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.8, 2.84, 48]} />
        <meshBasicMaterial color="#3FA66B" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

export const HeroScene = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] md:h-[440px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#E7F3EB] to-[#DCEEE2] dark:from-[#09140F] dark:to-[#051812] border border-forest/10 dark:border-forest-500/20 shadow-soft">
      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [4.2, 2.4, 4.6], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <SceneLighting />
            <ElectricCar position={[0, 0, 0]} isCharging={true} />
            <ChargingStation position={[1.2, 0, 1.8]} />
            <ChargingCable />
            <EnergyParticles count={24} isReducedMotion={isReducedMotion} />
            <FloorPedestal />
            <CameraController isReducedMotion={isReducedMotion} />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Status Badges & HUD */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-white text-xs font-heading font-medium shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-leaf animate-ping" />
          <span>Live Solar Charging</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-paper-surface/90 text-forest dark:text-emerald-300 text-xs font-medium border border-forest/10 backdrop-blur-md">
          <Sun className="w-3.5 h-3.5 text-amber" />
          <span>89% Clean Power</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
        <div className="px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-paper-surface/90 backdrop-blur-md border border-forest/10 dark:border-white/10 shadow-soft flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-100 dark:bg-forest-900/60 flex items-center justify-center">
            <Zap className="w-4 h-4 text-forest dark:text-leaf" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-ink-soft uppercase font-heading tracking-wider font-semibold">Charging Rate</div>
            <div className="text-xs sm:text-sm font-bold font-heading text-forest dark:text-emerald-400">50 kW DC • ₹6.80/kWh</div>
          </div>
        </div>
      </div>
    </div>
  );
};
