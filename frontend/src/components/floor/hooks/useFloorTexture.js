import { useState, useEffect } from "react";
import resourceManager from "../../../utils/ResourceManager";

export function useFloorTexture(selectedFloorTexture) {
  const [floorTexture, setFloorTexture] = useState(null);

  useEffect(() => {
    if (!selectedFloorTexture) {
      setFloorTexture(null);
      return;
    }

    const baseName = selectedFloorTexture.split('/').pop();
    const colorPath = `${selectedFloorTexture}/${baseName}_Color.jpg`;

    resourceManager.loadTexture(colorPath, { repeat: { x: 2, y: 2 } })
      .then(texture => {
        setFloorTexture(texture);
      })
      .catch(error => {
        console.error("Eroare la încărcarea texturii podelei:", error);
        setFloorTexture(null);
      });
  }, [selectedFloorTexture]);

  return floorTexture;
}
