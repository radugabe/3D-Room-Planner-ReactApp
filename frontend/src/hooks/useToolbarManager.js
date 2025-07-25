import { useState } from "react";

function useToolbarManager() {
  const [editMode, setEditMode] = useState("move");
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const toggleWireframeMode = () => {
    setWireframeMode(prev => !prev);
  };

  const toggleGrid = () => {
    setShowGrid(prev => !prev);
  };

  return {
    editMode,
    setEditMode,
    wireframeMode,
    toggleWireframeMode,
    showGrid,
    toggleGrid
  };
}

export default useToolbarManager;
