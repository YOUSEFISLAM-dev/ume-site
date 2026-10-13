import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { Constellation } from "./Constellation";
import { Floor } from "./Floor";
import { Monolith } from "./Monolith";

type SceneProps = {
  visible: boolean;
  reducedMotion: boolean;
  onCanvasReady: () => void;
  onReady: () => void;
};

function ReadySignal({ onReady }: { onReady: () => void }) {
  const sent = useRef(false);
  useFrame(() => {
    if (!sent.current) {
      sent.current = true;
      onReady();
    }
  });
  return null;
}

export default function Scene({ visible, reducedMotion, onCanvasReady, onReady }: SceneProps) {
  const lowEnd = useMemo(() => {
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const cores = navigator.hardwareConcurrency || 8;
    return mobile || cores <= 4;
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      className="scene-canvas"
      frameloop={visible ? "always" : "never"}
      dpr={lowEnd ? 1 : [1, 2]}
      shadows={!lowEnd}
      camera={{ position: [0, 1.3, 12.4], fov: 42, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: !lowEnd, powerPreference: "high-performance", failIfMajorPerformanceCaveat: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#F1EEE7", 1);
        gl.shadowMap.enabled = !lowEnd;
        onCanvasReady();
      }}
    >
      <color attach="background" args={["#F1EEE7"]} />
      <fog attach="fog" args={["#F1EEE7", 10, 28]} />
      <ambientLight intensity={1.75} />
      <hemisphereLight args={["#F1EEE7", "#E8E4DA", 1.25]} />
      <directionalLight castShadow position={[6, 9, 7]} intensity={2.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-7, 3, 3]} intensity={0.8} />
      <CameraRig reducedMotion={reducedMotion} />
      <Monolith reducedMotion={reducedMotion} />
      <Constellation reducedMotion={reducedMotion} />
      <Floor reducedMotion={reducedMotion} />
      {!lowEnd && <ContactShadows position={[0, -3.2, 0]} opacity={0.16} scale={20} blur={2.8} far={8} color="#141414" />}
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
