import { useEffect } from "react";
import { invalidate } from "@react-three/fiber";
import resourceManager from "../../../utils/ResourceManager";

export function useModelTextureUpdater({
  modelRef,
  isSelected,
  texturePath,
  itemTexturePath,
  applyHighlighting,
  setModels,
  index
}) {
  useEffect(() => {
    if (!modelRef.current) return;

    const currentTexture = texturePath ?? itemTexturePath;

    const apply = () => {
      if (!modelRef.current) return;

      if (!currentTexture) {
        modelRef.current.scene.traverse(node => {
          if (node.isMesh && modelRef.current.originalMaterials?.[node.uuid]) {
            node.material = modelRef.current.originalMaterials[node.uuid].clone();
            node.material.needsUpdate = true;
          }
        });
        invalidate();
        applyHighlighting(isSelected);

        setModels(prev => {
          const updated = [...prev];
          if (index < updated.length) {
            updated[index] = {
              ...updated[index],
              texturePath: null,
              __hasTexture: false,
              __textureApplied: false
            };
          }
          return updated;
        });

        return;
      }

      const pathParts = currentTexture.split('/');
      const materialName = pathParts[pathParts.length - 1];
      const normalizedMaterialName = materialName.charAt(0).toUpperCase() + materialName.slice(1);

      resourceManager.loadMaterialSet(currentTexture, normalizedMaterialName)
        .then(textureSet => {

          if (!modelRef.current) return;

          modelRef.current.scene.traverse(node => {
            if (node.isMesh) {
              node.material = resourceManager.createMaterial(textureSet, false);
              node.material.needsUpdate = true;
            }
          });

          modelRef.current.scene.updateMatrixWorld(true);
          invalidate();

          applyHighlighting(isSelected);

          setModels(prev => {
            const updated = [...prev];
            if (index < updated.length) {
              updated[index] = {
                ...updated[index],
                texturePath: currentTexture,
                __hasTexture: true,
                __textureApplied: true
              };
            }
            return updated;
          });
        });
    };

    const interval = setInterval(() => {
      if (modelRef.current) {
        clearInterval(interval);
        apply();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isSelected, texturePath, itemTexturePath, modelRef, applyHighlighting, setModels, index]);
}
