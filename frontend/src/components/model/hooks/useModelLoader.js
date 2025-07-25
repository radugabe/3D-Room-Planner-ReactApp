import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import resourceManager from "../../../utils/ResourceManager";

export function useModelLoader(modelPath, itemId, isSelected, position, applyHighlighting) {
  const modelRef = useRef(null);
  const [loadedModel, setLoadedModel] = useState(null);

  useEffect(() => {
    let isMounted = true;

    resourceManager.loadModel(modelPath)
      .then(gltf => {
        if (!isMounted) return;

        const clonedScene = gltf.scene.clone(true);
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        clonedScene.position.x -= center.x;
        clonedScene.position.z -= center.z;
        clonedScene.position.y -= box.min.y;

        const originalMaterials = {};
        clonedScene.traverse(node => {
          if (node.isMesh && node.material) {
            originalMaterials[node.uuid] = node.material.clone();
            console.log("[SAVE ORIGINAL]", node.name, node.uuid);
          }
        });

        const clone = {
          scene: clonedScene,
          originalMaterials
        };

        modelRef.current = clone;
        setLoadedModel(clone);
        applyHighlighting?.(isSelected);
      })
      .catch(error => {
        console.error("Error loading model:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [modelPath, itemId]);

  return { modelRef, loadedModel };
}
