import React, { useMemo } from "react";
import * as THREE from "three";

const Floor = React.memo(({ width, depth, texture, wireframeMode }) => {
  const material = useMemo(() => {
    return texture
      ? new THREE.MeshStandardMaterial({
          map: texture,
          wireframe: wireframeMode,
          roughness: 0.7,
          metalness: 0.1
        })
      : new THREE.MeshStandardMaterial({
          color: "#d3d3d3",
          wireframe: wireframeMode,
          roughness: 0.7,
          metalness: 0.1
        });
  }, [texture, wireframeMode]);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <primitive object={material} />
    </mesh>
  );
});

export default Floor;
