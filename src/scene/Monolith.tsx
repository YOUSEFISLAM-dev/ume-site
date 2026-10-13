import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBoxGeometry } from "three-stdlib";
import { useEmpireStore } from "../store";

const ink = "#141414";
const paper = "#F1EEE7";
const paperTwo = "#E8E4DA";
const signal = "#FF4D1C";
const files = [".pak", ".dll", ".assets", ".apk", ".exe", ".unity3d"];
const spread = [
  [-3.2, 1.5, 0.2, -0.12],
  [2.9, 2.35, -0.5, 0.15],
  [-2.35, -1.2, -0.8, 0.2],
  [3.4, -0.7, 0.55, -0.19],
  [-0.35, 3.55, -1.2, 0.08],
  [0.4, -3.0, 0.85, -0.1]
] as const;
const ordered = [
  [-2.25, 1.1, 0, 0],
  [0, 1.1, 0, 0],
  [2.25, 1.1, 0, 0],
  [-2.25, -1.1, 0, 0],
  [0, -1.1, 0, 0],
  [2.25, -1.1, 0, 0]
] as const;

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function labelTexture(label: string, active: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = active ? paper : ink;
  context.font = "600 58px Geist Mono, monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, canvas.width / 2, canvas.height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

type LabelProps = {
  index: number;
  label: string;
  active: boolean;
  reducedMotion: boolean;
};

function SlabLabel({ index, label, active, reducedMotion }: LabelProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => labelTexture(label, active), [active, label]);
  const material = useMemo(() => new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.92 }), [texture]);

  useEffect(() => () => {
    texture.dispose();
    material.dispose();
  }, [material, texture]);

  useFrame(() => {
    const progress = reducedMotion ? 0 : useEmpireStore.getState().scrollProgress;
    const drift = smoothstep(0.07, 0.46, progress);
    const settle = smoothstep(0.8, 0.96, progress);
    const stackedY = 1.45 - index * 0.58;
    const dispersed = spread[index];
    const grid = ordered[index];
    const x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0, dispersed[0], drift), grid[0], settle);
    const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(stackedY, dispersed[1], drift), grid[1], settle);
    const z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(index * -0.06, dispersed[2], drift), grid[2], settle);
    if (spriteRef.current) spriteRef.current.position.set(x, y, z + 0.78);
  });

  return <sprite ref={spriteRef} scale={[2.55, 0.64, 1]} material={material} />;
}

type MonolithProps = {
  reducedMotion: boolean;
};

export function Monolith({ reducedMotion }: MonolithProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new RoundedBoxGeometry(4.8, 0.76, 1.42, 5, 0.12), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: paperTwo, roughness: 0.83, metalness: 0.01 }), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    files.forEach((_, index) => {
      mesh.setColorAt(index, new THREE.Color(index === 2 ? signal : index % 2 === 0 ? paperTwo : ink));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(() => {
    const progress = reducedMotion ? 0 : useEmpireStore.getState().scrollProgress;
    const drift = smoothstep(0.07, 0.46, progress);
    const settle = smoothstep(0.8, 0.96, progress);
    const mesh = meshRef.current;
    if (!mesh) return;

    files.forEach((_, index) => {
      const stackedY = 1.45 - index * 0.58;
      const dispersed = spread[index];
      const grid = ordered[index];
      const x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0, dispersed[0], drift), grid[0], settle);
      const y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(stackedY, dispersed[1], drift), grid[1], settle);
      const z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(index * -0.06, dispersed[2], drift), grid[2], settle);
      const rotation = THREE.MathUtils.lerp(dispersed[3], grid[3], settle) * drift;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotation, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0.9, 0.3, 0]}>
      <instancedMesh ref={meshRef} args={[geometry, material, files.length]} castShadow receiveShadow />
      {files.map((label, index) => <SlabLabel key={label} index={index} label={label} active={index === 2} reducedMotion={reducedMotion} />)}
    </group>
  );
}
