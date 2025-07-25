import { useEffect, useState } from "react";
import resourceManager from "../utils/ResourceManager";

function useFloorTextureLoader(selectedFloorTexture) {
  const [floorTexture, setFloorTexture] = useState(null);

  useEffect(() => {
    if (selectedFloorTexture) {
      const baseName = selectedFloorTexture.split('/').pop();
      const colorPath = `${selectedFloorTexture}/${baseName}_Color.jpg`;

      resourceManager
        .loadTexture(colorPath, { repeat: { x: 2, y: 2 } })
        .then(texture => setFloorTexture(texture))
        .catch(() => setFloorTexture(null));
    } else {
      setFloorTexture(null);
    }
  }, [selectedFloorTexture]);

  return floorTexture;
}

export default useFloorTextureLoader;
