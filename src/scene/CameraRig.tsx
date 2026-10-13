import { useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { territories } from "../data/territories";
import { useEmpireStore } from "../store";

type Waypoint = {
  position: [number, number, number];
  target: [number, number, number];
};

const path: Waypoint[] = [
  { position: [0.7, 1.25, 12.8], target: [0.6, 0.35, 0] },
  { position: [0.15, 3.2, 15.4], target: [0, 0.8, 0] },
  { position: [-0.3, 1.8, 12.2], target: [0, -0.1, 0] },
  { position: [0, 3.85, 16.8], target: [0, 0.05, 0] },
  { position: [0.4, 2.4, 14.6], target: [0, 0, 0] },
  { position: [0, 4.1, 17.6], target: [0, -0.35, 0] }
];

export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const vectors = useMemo(() => ({
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    desiredPosition: new THREE.Vector3(),
    desiredTarget: new THREE.Vector3(),
    lookAt: new THREE.Vector3()
  }), []);

  useFrame((_, delta) => {
    const store = useEmpireStore.getState();
    const progress = reducedMotion ? 0 : store.scrollProgress;
    const segmentPosition = progress * (path.length - 1);
    const index = Math.min(path.length - 2, Math.floor(segmentPosition));
    const mix = Math.min(1, segmentPosition - index);

    vectors.from.set(...path[index].position);
    vectors.to.set(...path[index + 1].position);
    vectors.desiredPosition.lerpVectors(vectors.from, vectors.to, mix);
    vectors.from.set(...path[index].target);
    vectors.to.set(...path[index + 1].target);
    vectors.desiredTarget.lerpVectors(vectors.from, vectors.to, mix);

    if (!reducedMotion) {
      vectors.desiredPosition.x += store.pointerX * 0.18;
      vectors.desiredPosition.y -= store.pointerY * 0.1;
    }

    if (store.focusedTerritory) {
      const selected = territories.find((territory) => territory.id === store.focusedTerritory);
      if (selected) {
        vectors.from.set(...selected.position);
        vectors.desiredTarget.lerp(vectors.from, 0.62);
        vectors.desiredPosition.x += selected.position[0] * 0.3;
        vectors.desiredPosition.y += selected.position[1] * 0.12;
      }
    }

    const easing = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.9);
    camera.position.lerp(vectors.desiredPosition, easing);
    vectors.lookAt.lerp(vectors.desiredTarget, easing);
    camera.lookAt(vectors.lookAt);
  });

  return null;
}
