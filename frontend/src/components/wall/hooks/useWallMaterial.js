import { useRef, useEffect } from "react";
import * as THREE from "three";

export function useWallMaterial({ color, wallTexture, wireframeMode, isSelected }) {
  const material = useRef(new THREE.MeshStandardMaterial({
    color,
    wireframe: wireframeMode,
    roughness: 0.9,
    metalness: 0
  }));

  useEffect(() => {
    if (wallTexture) {
      material.current.map = wallTexture;
    } else {
      material.current.map = null;
      material.current.color.set(color);
    }
    material.current.wireframe = wireframeMode;
    material.current.needsUpdate = true;
  }, [wallTexture, wireframeMode, color]);

  useEffect(() => {
    if (isSelected) {
      material.current.emissive.set(0xb07a36);
      material.current.emissiveIntensity = 0.2;
    } else {
      material.current.emissive.set(0x000000);
      material.current.emissiveIntensity = 0;
    }
    material.current.needsUpdate = true;
  }, [isSelected]);

  return material;
}