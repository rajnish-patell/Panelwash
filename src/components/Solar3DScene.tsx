"use strict";
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Procedural Solar Panel Component
function SolarPanel({ cleanProgress }: { cleanProgress: number }) {
  const panelRef = useRef<THREE.Group>(null);
  const squeegeeRef = useRef<THREE.Mesh>(null);

  // We rotate the panel slightly for dynamic feel
  useFrame((state) => {
    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      panelRef.current.rotation.x = -0.5 + Math.cos(state.clock.getElapsedTime() * 0.15) * 0.05;
    }

    // Animate squeegee position based on clean progress
    if (squeegeeRef.current) {
      // cleanProgress goes from 0 to 1. Map to Y position of panel
      // Panel is 3 units tall, centered at 0. So Y ranges from 1.6 to -1.6
      const targetY = 1.6 - (cleanProgress * 3.2);
      squeegeeRef.current.position.y = THREE.MathUtils.lerp(
        squeegeeRef.current.position.y,
        targetY,
        0.1
      );
      // Hide squeegee if not in action or complete
      if (cleanProgress <= 0 || cleanProgress >= 1) {
        squeegeeRef.current.visible = false;
      } else {
        squeegeeRef.current.visible = true;
      }
    }
  });

  // Calculate material properties dynamically
  // 0 = Dusty/Dirty (grey-brown, rough, matte)
  // 1 = Sparkling Clean (deep navy blue, highly shiny and reflective)
  const cellColor = new THREE.Color().lerpColors(
    new THREE.Color("#5C5D60"), // Dusty grey
    new THREE.Color("#0A2240"), // Deep Solar Blue
    cleanProgress
  );

  const cellRoughness = THREE.MathUtils.lerp(0.9, 0.1, cleanProgress);
  const cellMetalness = THREE.MathUtils.lerp(0.1, 0.95, cleanProgress);

  return (
    <group ref={panelRef}>
      {/* Outer Aluminum Frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.2, 3.2, 0.08]} />
        <meshStandardMaterial color="#A1A1A5" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Solar Cells Grid Backdrop */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.0, 3.0, 0.04]} />
        <meshStandardMaterial
          color={cellColor}
          roughness={cellRoughness}
          metalness={cellMetalness}
        />
      </mesh>

      {/* Grid Lines (Silver wires on solar panels) */}
      {/* Vertical wires */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0, 0.022]}>
          <boxGeometry args={[0.01, 2.98, 0.005]} />
          <meshBasicMaterial color="#E2E8F0" opacity={0.6} transparent />
        </mesh>
      ))}

      {/* Horizontal wires */}
      {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((y, i) => (
        <mesh key={`h-${i}`} position={[0, y, 0.022]}>
          <boxGeometry args={[1.98, 0.01, 0.005]} />
          <meshBasicMaterial color="#E2E8F0" opacity={0.6} transparent />
        </mesh>
      ))}

      {/* Squeegee Squeezer Clean Effect */}
      <mesh ref={squeegeeRef} position={[0, 1.6, 0.035]}>
        <boxGeometry args={[2.1, 0.08, 0.04]} />
        <meshStandardMaterial color="#FFC72C" emissive="#FFC72C" emissiveIntensity={0.5} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Dust Particle Environment Component
function DustParticles({ cleanProgress }: { cleanProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 250;

  const [positions] = useState(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 6; // X
      arr[i + 1] = (Math.random() - 0.5) * 6; // Y
      arr[i + 2] = (Math.random() - 0.5) * 4 + 1; // Z (closer to camera)
    }
    return arr;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate particles slowly
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;

      // Animate material opacity based on clean progress
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        // As panel cleans, dust opacity drops
        mat.opacity = THREE.MathUtils.lerp(0.8, 0.05, cleanProgress);
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D4AF37"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Lighting setup mimicking high sun and reflections
function SunLight() {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (sunLightRef.current) {
      // Oscillate sun position slightly to capture changing highlights
      const time = state.clock.getElapsedTime() * 0.2;
      sunLightRef.current.position.x = 5 + Math.sin(time) * 2;
      sunLightRef.current.position.z = 4 + Math.cos(time) * 1.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        ref={sunLightRef}
        position={[6, 5, 4]}
        intensity={1.8}
        castShadow
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#00E5FF" />
      <pointLight position={[0, 0, 2]} intensity={0.8} color="#FFC72C" />
    </>
  );
}

export default function Solar3DScene() {
  const [cleanProgress, setCleanProgress] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  // WebGL support detection
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setHasWebGL(!!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const triggerClean = () => {
    if (isCleaning) return;
    setIsCleaning(true);
    setCleanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
        setIsCleaning(false);
      }
      setCleanProgress(progress);
    }, 30);
  };

  if (hasWebGL === false) {
    // Fallback static 2D illustration/card if WebGL isn't supported
    return (
      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden glassmorphism flex flex-col items-center justify-center p-6 border border-solar-border">
        <div className="absolute inset-0 bg-gradient-to-br from-solar-deep/50 to-solar-dark -z-10" />
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-solar-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-solar-yellow/40">
            <svg className="w-12 h-12 text-solar-yellow animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Solar Panel Optimization</h3>
          <p className="text-gray-400 text-sm mb-6">
            Rooftop solar systems lose up to <span className="text-solar-yellow font-bold">30% efficiency</span> due to accumulated dust, soot, and air pollution.
          </p>
          <button
            onClick={() => setCleanProgress((prev) => (prev === 0 ? 1 : 0))}
            className="px-6 py-2 bg-solar-yellow text-solar-deep font-bold rounded-lg hover:bg-white transition-all shadow-lg"
          >
            {cleanProgress === 0 ? "Show Clean Panel" : "Show Dirty Panel"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] sm:h-[500px] rounded-3xl overflow-hidden border border-solar-border shadow-solar glassmorphism flex flex-col justify-end">
      {/* ThreeJS Canvas */}
      {hasWebGL && (
        <div className="absolute inset-0 w-full h-full">
          <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }} dpr={[1, 2]}>
            <color attach="background" args={["#030d1a"]} />
            <SunLight />
            <SolarPanel cleanProgress={cleanProgress} />
            <DustParticles cleanProgress={cleanProgress} />
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
          </Canvas>
        </div>
      )}

      {/* Floating UI overlay */}
      <div className="relative p-4 sm:p-6 bg-gradient-to-t from-solar-dark/90 via-solar-dark/40 to-transparent w-full border-t border-solar-border z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 text-[10px] sm:text-xs font-bold bg-solar-yellow/20 text-solar-yellow rounded-full border border-solar-yellow/30 mb-1.5 sm:mb-2">
            Interactive 3D Demo
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
            Suraj Ki Shakti: {cleanProgress === 0 ? (
              <span className="text-red-400 font-semibold text-xs sm:text-sm">30% Power Loss (Dirty)</span>
            ) : cleanProgress === 1 ? (
              <span className="text-solar-bright font-semibold text-xs sm:text-sm">100% Efficiency (Clean!)</span>
            ) : (
              <span className="text-solar-yellow font-semibold text-xs sm:text-sm">Cleaning in progress...</span>
            )}
          </h4>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1 max-w-sm">
            Drag to rotate solar panel. Click "Start Cleaning Wash" to sweep away dust & pollutants.
          </p>
        </div>

        <button
          onClick={triggerClean}
          disabled={isCleaning}
          className={`w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base ${
            isCleaning
              ? "bg-solar-deep/80 text-gray-400 cursor-not-allowed border border-solar-border"
              : "bg-gradient-sun text-solar-deep hover:scale-105 active:scale-95"
          }`}
        >
          {isCleaning ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Washing...
            </>
          ) : cleanProgress === 1 ? (
            "Restart Wash"
          ) : (
            "Start Cleaning Wash"
          )}
        </button>
      </div>
    </div>
  );
}
