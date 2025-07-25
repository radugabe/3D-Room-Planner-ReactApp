import { useState, useRef } from "react";

function useWallManager() {
  const [wallSelectionMode, setWallSelectionMode] = useState(false);
  const [selectedWall, setSelectedWall] = useState(null);
  const [wallProps, setWallProps] = useState(null);

  const handleWallUpdateRef = useRef(null);
  const isUpdatingWallRef = useRef(false);

  const handleWallSelect = (wallName) => {
    setSelectedWall(wallName);
  };

  const handleWallUpdate = (wallName, newProps) => {
    if (!handleWallUpdateRef.current) {
      console.warn("handleWallUpdateRef is not yet initialized");
      return;
    }
    if (isUpdatingWallRef.current) return;

    isUpdatingWallRef.current = true;
    handleWallUpdateRef.current(wallName, newProps);
    setTimeout(() => {
      isUpdatingWallRef.current = false;
    }, 16);
  };

  const setWallUpdateFunction = (updateFunction) => {
    handleWallUpdateRef.current = updateFunction;
  };

  const handleSetWallProps = (props) => {
    if (!isUpdatingWallRef.current) {
      setWallProps(props);
    }
  };

  const handleWallResizeRoomChange = (newRoomSize, setRoomSize) => {
    setRoomSize(prevSize => ({
      ...prevSize,
      width: newRoomSize.width,
      height: newRoomSize.height,
      depth: newRoomSize.depth
    }));
  };

  return {
    wallSelectionMode,
    setWallSelectionMode,
    selectedWall,
    setSelectedWall,
    wallProps,
    setWallProps,
    handleWallSelect,
    handleWallUpdate,
    setWallUpdateFunction,
    handleSetWallProps,
    handleWallResizeRoomChange
  };
}

export default useWallManager;
