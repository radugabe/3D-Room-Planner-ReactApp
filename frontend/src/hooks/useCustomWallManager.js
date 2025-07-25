import { useState } from "react";

function useCustomWallManager() {
  const [customWalls, setCustomWalls] = useState([]);
  const [selectedWallIndex, setSelectedWallIndex] = useState(null);
  const [wallCreationMode, setWallCreationMode] = useState(false);

  const toggleWallCreationMode = () => {
    setWallCreationMode(prev => !prev);
    setSelectedWallIndex(null);
  };

  const handleWallUpdate = (index, newPositions) => {
    const updated = [...customWalls];
    if (index >= 0 && index < updated.length) {
      updated[index] = { ...updated[index], ...newPositions };
      setCustomWalls(updated);
    }
  };

  const handleCustomWallsUpdate = (walls) => {
    setCustomWalls(walls);
  };

  return {
    customWalls,
    setCustomWalls,
    selectedWallIndex,
    setSelectedWallIndex,
    wallCreationMode,
    toggleWallCreationMode,
    handleWallUpdate,
    handleCustomWallsUpdate
  };
}

export default useCustomWallManager;
