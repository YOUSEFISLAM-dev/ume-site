import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEmpireStore } from "../store";

const ink = "#141414";

export function Floor({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lowEnd = useMemo(() => window.matchMedia("(max-width: 760px)").matches || (navigator.hardwareConcurrency || 8) <= 4, []);
  const divisions = lowEnd ? 13 : 21;
  const count = divisions * divisions;
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.018, 0.018, 0.018, 8), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: ink, roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const extent = 11;
    let index = 0;
    for (let row = 0; row < divisions; row += 1) {
      for (let column = 0; column < divisions; column += 1) {
        const x = -extent / 2 + (extent * column) / (divisions - 1);
        const z = -extent / 2 + (extent * row) / (divisions - 1);
        dummy.position.set(x, 0, z);
        dummy.scale.setScalar((row + column) % 4 === 0 ? 1.55 : 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        index += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [divisions, dummy]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(() => {
    const progress = reducedMotion ? 0.5 : useEmpireStore.getState().scrollProgress;
    const appear = THREE.MathUtils.smoothstep(progress, 0.37, 0.5);
    const settle = THREE.MathUtils.smoothstep(progress, 0.8, 0.95);
    material.opacity = 0.17 * Math.max(appear * (1 - settle * 0.3), settle * 0.7);
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} position={[0, -3.2, 0]} receiveShadow />;
}
