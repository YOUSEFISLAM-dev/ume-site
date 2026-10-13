import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { territories } from "../data/territories";
import type { TerritoryStatus } from "../data/territories";
import { useEmpireStore } from "../store";

const ink = "#141414";
const paper = "#F1EEE7";
const signal = "#FF4D1C";
const statusOpacity: Record<TerritoryStatus, number> = {
  ACTIVE: 0.92,
  RESEARCH: 0.58,
  PLANNED: 0.34
};

function visibility(progress: number) {
  const enter = THREE.MathUtils.smoothstep(progress, 0.42, 0.53);
  const leave = 1 - THREE.MathUtils.smoothstep(progress, 0.8, 0.9);
  return enter * leave;
}

type TerritoryNodeProps = {
  id: string;
  label: string;
  position: [number, number, number];
  status: TerritoryStatus;
  reducedMotion: boolean;
};

function TerritoryNode({ id, label, position, status, reducedMotion }: TerritoryNodeProps) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const outline = useRef<THREE.MeshStandardMaterial>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const nodeColor = status === "ACTIVE" ? signal : ink;

  const onOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    useEmpireStore.getState().setHoveredTerritory(id);
  };
  const onOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    useEmpireStore.getState().setHoveredTerritory(null);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const current = useEmpireStore.getState().focusedTerritory;
    useEmpireStore.getState().setFocusedTerritory(current === id ? null : id);
  };

  useFrame(() => {
    const state = useEmpireStore.getState();
    const selected = state.hoveredTerritory === id || state.focusedTerritory === id;
    const opacity = visibility(reducedMotion ? 0.5 : state.scrollProgress) * statusOpacity[status] * (selected ? 1 : 0.76);
    if (material.current) material.current.opacity = opacity;
    if (outline.current) outline.current.opacity = Math.min(1, opacity + (status === "PLANNED" ? 0.2 : 0));
    if (labelRef.current) labelRef.current.style.opacity = String(opacity);
  });

  return (
    <group position={position} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.09, 6]} />
        <meshStandardMaterial
          ref={material}
          color={nodeColor}
          roughness={0.76}
          metalness={0}
          transparent
          opacity={0}
          wireframe={status === "PLANNED"}
        />
      </mesh>
      {status !== "PLANNED" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={status === "ACTIVE" ? 0.48 : 0.3}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 6]} />
          <meshStandardMaterial ref={outline} color={nodeColor} roughness={0.82} transparent opacity={0} />
        </mesh>
      )}
      {status === "PLANNED" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.57}>
          <cylinderGeometry args={[0.2, 0.2, 0.095, 6]} />
          <meshStandardMaterial ref={outline} color={paper} roughness={0.9} transparent opacity={0} wireframe />
        </mesh>
      )}
      <Html position={[0.32, 0.18, 0]} center={false} distanceFactor={9} transform sprite zIndexRange={[0, 0]} pointerEvents="none">
        <div ref={labelRef} className={`node-label node-label--${status.toLowerCase()}`}>
          <span>{label}</span><b>{status}</b>
        </div>
      </Html>
    </group>
  );
}

function Links({ reducedMotion }: { reducedMotion: boolean }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    territories.forEach(({ position }) => positions.push(0, 0, 0, ...position));
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return result;
  }, []);
  const material = useMemo(() => new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0, depthWrite: false }), []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(() => {
    const progress = reducedMotion ? 0.5 : useEmpireStore.getState().scrollProgress;
    material.opacity = 0.28 * visibility(progress);
  });

  return <lineSegments geometry={geometry} material={material} />;
}

function PillarMarkers() {
  const materialRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const positions = useMemo(() => [-3.6, -1.2, 1.2, 3.6], []);

  useFrame(() => {
    const active = useEmpireStore.getState().activePillar;
    materialRefs.current.forEach((material, index) => {
      if (!material) return;
      material.color.set(active === index ? signal : ink);
      material.opacity = active === index ? 0.92 : 0.22;
    });
  });

  return (
    <group position={[0, -0.2, 0.25]}>
      {positions.map((x, index) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.74, 0.18, 0.48]} />
          <meshStandardMaterial
            ref={(material) => { materialRefs.current[index] = material; }}
            color={ink}
            roughness={0.8}
            transparent
            opacity={0.22}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Constellation({ reducedMotion }: { reducedMotion: boolean }) {
  const hubMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: ink, roughness: 0.78 }), []);

  useEffect(() => () => hubMaterial.dispose(), [hubMaterial]);

  return (
    <group>
      <Links reducedMotion={reducedMotion} />
      <group>
        {territories.map((territory) => <TerritoryNode key={territory.id} {...territory} reducedMotion={reducedMotion} />)}
      </group>
      <mesh rotation={[0, Math.PI / 8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.28, 0.58]} />
        <primitive object={hubMaterial} attach="material" />
      </mesh>
      <Html position={[0, 0.34, 0]} center distanceFactor={9} transform sprite zIndexRange={[0, 0]} pointerEvents="none">
        <div className="node-label node-label--hub"><span>UME</span><b>HUB</b></div>
      </Html>
      <PillarMarkers />
    </group>
  );
}
