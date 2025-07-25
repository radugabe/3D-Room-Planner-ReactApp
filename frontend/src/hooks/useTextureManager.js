import { useState } from "react";

function useTextureManager() {
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [selectedFloorTexture, setSelectedFloorTexture] = useState(null);
  const [selectedWallTexture, setSelectedWallTexture] = useState(null);

  const handleSelectTexture = (texturePath) => {
    setSelectedTexture(texturePath);
  };

  return {
    selectedTexture,
    setSelectedTexture,
    selectedFloorTexture,
    setSelectedFloorTexture,
    selectedWallTexture,
    setSelectedWallTexture,
    handleSelectTexture
  };
}

export default useTextureManager;
