import React, { useMemo } from "react";
import * as THREE from "three";

const Floor = React.memo(({ width, depth, position, floorTexture, wireframeMode }) => {
  const material = useMemo(() => {
    if (floorTexture) {
      return new THREE.MeshStandardMaterial({
        map: floorTexture,
        wireframe: wireframeMode,
        roughness: 0.7,
        metalness: 0.1
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color: "#d3d3d3",
        wireframe: wireframeMode,
        roughness: 0.7,
        metalness: 0.1
      });
    }
  }, [floorTexture, wireframeMode]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <primitive object={material} />
    </mesh>
  );
});

export default Floor;
