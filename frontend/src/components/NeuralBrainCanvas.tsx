import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL CORTICAL HEMISPHERE
// ─────────────────────────────────────────────────────────────────────────────
function CerebralHemisphere({ isLeft = true, dark = false }: { isLeft: boolean; dark?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const xOffset = isLeft ? -0.85 : 0.85;

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.25, 64, 64);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      v.z *= 1.35;
      v.y *= 1.1;
      v.x *= 0.95;

      // Broad, irregular cortical folds: deliberately restrained because this
      // procedural form is a visual fallback, not a medical anatomy model.
      const foldA = Math.sin(v.y * 6.2 + Math.sin(v.z * 2.1) * 1.3) * 0.055;
      const foldB = Math.cos(v.z * 7.1 + Math.sin(v.y * 2.7) * 1.1) * 0.05;
      const foldC = Math.sin(v.x * 7.6 + v.z * 2.4) * Math.cos(v.y * 5.2) * 0.035;
      const microDetail = Math.sin(v.x * 13.0 + v.z * 9.0) * Math.cos(v.y * 11.0) * 0.012;

      const displacement = 1.0 + foldA + foldB + foldC + microDetail;
      v.multiplyScalar(displacement);

      if (isLeft && v.x > 0.08) v.x = 0.08 - (v.x - 0.08) * 0.18;
      else if (!isLeft && v.x < -0.08) v.x = -0.08 + (-v.x - 0.08) * 0.18;

      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [isLeft]);

  // Slow breathing pulse
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const breath = 1 + Math.sin(t * 0.8) * 0.008;
    meshRef.current.scale.set(breath, breath, breath);
  });

  const baseColor = dark
    ? (isLeft ? '#3D2D7A' : '#4A2E8F')
    : (isLeft ? '#ECE8FF' : '#F4F0FF');

  return (
    <mesh ref={meshRef} position={[xOffset, 0, 0]} geometry={geometry}>
      <meshPhysicalMaterial
        color={baseColor}
        roughness={0.22}
        metalness={0.12}
        transmission={dark ? 0.25 : 0.5}
        thickness={1.0}
        ior={1.5}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        emissive="#7954F5"
        emissiveIntensity={dark ? 0.22 : 0.14}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

// BRAINSTEM / SPINAL COLUMN
// ─────────────────────────────────────────────────────────────────────────────
function BrainStem() {
  return (
    <group position={[0, -1.35, 0]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.26, 0.75, 20]} />
        <meshPhysicalMaterial
          color="#C4AEFF"
          roughness={0.3}
          transmission={0.6}
          emissive="#7954F5"
          emissiveIntensity={0.18}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Brainstem glow ring */}
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 12, 40]} />
        <meshBasicMaterial color="#B8A4FF" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// MASTER NEURAL SCENE
// ─────────────────────────────────────────────────────────────────────────────
function NeuralScene({ mousePos, dark, animate = true }: { mousePos: { x: number; y: number }; dark?: boolean; animate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (animate) groupRef.current.rotation.y += delta * 0.2;

    const targetX = mousePos.y * 0.32;
    const targetZ = -mousePos.x * 0.18;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, animate ? targetX : 0, 0.045);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, animate ? targetZ : 0, 0.045);
  });

  return (
    <group ref={groupRef} position={[0, 0.32, 0]}>
      <CerebralHemisphere isLeft={true}  dark={dark} />
      <CerebralHemisphere isLeft={false} dark={dark} />
      <BrainStem />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WATERMARK VARIANT (background, no interaction, subtle opacity)
// ─────────────────────────────────────────────────────────────────────────────
export const NeuralBrainWatermark: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const [hasError, setHasError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (hasError) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      onError={() => setHasError(true)}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={dark ? 0.5 : 0.7} />
      <directionalLight position={[4, 5, 5]} intensity={dark ? 1.1 : 1.3} color="#FFFFFF" />
      <pointLight position={[-4, 3, -2]} intensity={dark ? 1.4 : 0.9} color="#B8A4FF" />
      <NeuralScene mousePos={{ x: 0, y: 0 }} dark={dark} animate={!reducedMotion} />
    </Canvas>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE HERO VARIANT (with mouse parallax, full lighting)
// ─────────────────────────────────────────────────────────────────────────────
export const NeuralBrainCanvas: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [hasWebGlError, setError]   = useState(false);
  const [reducedMotion, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = () => setReduced(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    const y = -(((e.clientY - rect.top)  / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  if (hasWebGlError) {
    return (
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: dark ? 'radial-gradient(circle, #2A1D5E 0%, transparent 70%)' : 'radial-gradient(circle, #F1EDFF 0%, transparent 70%)'
      }}>
        <svg viewBox="0 0 300 300" width="280" height="280" fill="none">
          <circle cx="150" cy="150" r="130" stroke="#E8E2FA" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="150" cy="150" r="95"  stroke="#B8A4FF" strokeWidth="1.5" />
          <path d="M145 60 C110 60, 85 85, 85 125 C85 155, 95 180, 110 205 C125 230, 140 240, 145 245 Z" fill="#F4F0FF" stroke="#7954F5" strokeWidth="2" />
          <path d="M155 60 C190 60, 215 85, 215 125 C215 155, 205 180, 190 205 C175 230, 160 240, 155 245 Z" fill="#ECE8FF" stroke="#7954F5" strokeWidth="2" />
          <path d="M115 110 Q130 130 115 160" stroke="#B8A4FF" strokeWidth="2" fill="none" />
          <path d="M185 110 Q170 130 185 160" stroke="#B8A4FF" strokeWidth="2" fill="none" />
          <circle cx="115" cy="110" r="4" fill="#7954F5" />
          <circle cx="185" cy="110" r="4" fill="#7954F5" />
          <circle cx="130" cy="130" r="3" fill="#B8A4FF" />
          <circle cx="170" cy="130" r="3" fill="#B8A4FF" />
          <circle cx="150" cy="150" r="5" fill="#7954F5" />
        </svg>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'default' }}
      title="Slowly rotating procedural 3D brain illustration"
    >
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        onError={() => setError(true)}
      >
        <ambientLight intensity={dark ? 0.65 : 0.9} />
        <directionalLight position={[5,  6,  4]} intensity={dark ? 1.0 : 1.3} color="#FFFFFF" />
        <pointLight       position={[-4, 3, -2]} intensity={dark ? 1.5 : 1.0} color="#B8A4FF" />
        <pointLight       position={[3, -2,  2]} intensity={dark ? 1.0 : 0.65} color="#7954F5" />
        <pointLight position={[-2, -3, -3]} intensity={dark ? 0.8 : 0.45} color="#7954F5" />
        <NeuralScene mousePos={mousePos} dark={dark} animate={!reducedMotion} />
      </Canvas>
    </div>
  );
};
