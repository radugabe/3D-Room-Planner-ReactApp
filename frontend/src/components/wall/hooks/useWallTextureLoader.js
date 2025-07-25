import { useEffect, useState } from "react";
import resourceManager from "../../../utils/ResourceManager";

export function useWallTextureLoader(texturePath) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (texturePath) {
      const baseName = texturePath.split('/').pop();
      const colorPath = `${texturePath}/${baseName}_Color.jpg`;
      resourceManager.loadTexture(colorPath, { repeat: { x: 2, y: 2 } })
        .then(setTexture)
        .catch(() => {});
    } else {
      setTexture(null);
    }
  }, [texturePath]);

  return texture;
}
