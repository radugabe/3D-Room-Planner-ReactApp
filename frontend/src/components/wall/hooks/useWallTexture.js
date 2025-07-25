import { useState, useEffect } from "react";
import resourceManager from "../../../utils/ResourceManager";

export function useWallTexture(selectedWallTexture) {
  const [wallTexture, setWallTexture] = useState(null);

  useEffect(() => {
    if (!selectedWallTexture) {
      setWallTexture(null);
      return;
    }

    const baseName = selectedWallTexture.split('/').pop();
    const colorPath = `${selectedWallTexture}/${baseName}_Color.jpg`;

    resourceManager.loadTexture(colorPath, { repeat: { x: 2, y: 2 } })
      .then(texture => {
        setWallTexture(texture);
      })
      .catch(error => {
        console.error("Eroare la încărcarea texturii pereților:", error);
        setWallTexture(null);
      });
  }, [selectedWallTexture]);

  return wallTexture;
}
