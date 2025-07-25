import { useState } from "react";
import { SCENE } from "../utils/Constants";

function useRoomManager() {
  const [roomSize, setRoomSize] = useState(SCENE.DEFAULT_ROOM_SIZE);
  const [showRoomDimensionsDialog, setShowRoomDimensionsDialog] = useState(false);

  const handleRoomDimensionsChange = (newDimensions) => {
    setRoomSize(newDimensions);
    setShowRoomDimensionsDialog(false);
  };

  const openRoomDimensionsDialog = () => {
    setShowRoomDimensionsDialog(true);
  };

  const closeRoomDimensionsDialog = () => {
    setShowRoomDimensionsDialog(false);
  };

  return {
    roomSize,
    setRoomSize,
    showRoomDimensionsDialog,
    handleRoomDimensionsChange,
    openRoomDimensionsDialog,
    closeRoomDimensionsDialog
  };
}

export default useRoomManager;
