import React, { useState, useEffect, useContext } from "react";

import { AppContext } from "../App";
import Scene from "../components/view/rectangular/Scene";
import Sidebar from "../components/layout/Sidebar";
import Toolbar from "../components/layout/Toolbar";
import LoadingOverlay from "../components/common/LoadingOverlay";
import RoomDimensionsDialog from "../components/room/RoomDimensionsDialog";
import WallPropertiesPanel from "../components/wall/general/WallPropertiesPanel";
import ObjectControls from "../components/controls/ObjectControls";

import useModelManager from "../hooks/useModelManager";
import useWallManager from "../hooks/useWallManager";
import useRoomManager from "../hooks/useRoomManager";
import useTextureManager from "../hooks/useTextureManager";
import useSidebarManager from "../hooks/useSidebarManager";
import { useSceneLoading } from "../hooks/useSceneLoading";
import { useTextureRefresh } from "../hooks/useTextureRefresh";

function Planner() {
  const { setSelectedMode } = useContext(AppContext);
  const [moveVertical, setMoveVertical] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState("move");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const { importedProject } = useContext(AppContext);
  const { collapsedSections, toggleSectionCollapse } = useSidebarManager();

  const {
    models,
    setModels,
    selectedModelIndex,
    setSelectedModelIndex,
    handleScaleChange,
    handleRotation,
    deleteSelectedModel,
    getSelectedModelScale,
    getSelectedModelRotation
  } = useModelManager();

  const isSceneLoading = useSceneLoading(models);

  const {
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
  } = useWallManager();

  const {
    roomSize,
    setRoomSize,
    showRoomDimensionsDialog,
    handleRoomDimensionsChange,
    openRoomDimensionsDialog,
    closeRoomDimensionsDialog
  } = useRoomManager();

  const {
    selectedTexture,
    setSelectedTexture,
    selectedFloorTexture,
    setSelectedFloorTexture,
    selectedWallTexture,
    setSelectedWallTexture,
    handleSelectTexture
  } = useTextureManager();

  const { forceRefreshTextures, refreshing } = useTextureRefresh(models, setSelectedModelIndex);

  const handleTextureChange = (texturePath) => {
    setSelectedTexture(texturePath);
    if (selectedModelIndex !== null) {
      const updated = [...models];
      updated[selectedModelIndex] = {
        ...updated[selectedModelIndex],
        texturePath
      };
      setModels(updated);
    }

    setTimeout(() => setSelectedTexture(null), 50);
  };

  const toggleSelectionMode = () => {
    setWallSelectionMode(!wallSelectionMode);
  };

  const handleSelectModel = (index) => {
    setSelectedModelIndex(index);
    setSelectedTexture(null);
  };  

  useEffect(() => {
    if (wallSelectionMode) {
      setSelectedModelIndex(null);
    } else {
      setSelectedWall(null);
    }
  }, [wallSelectionMode]);

  useEffect(() => {
    if (importedProject) {
      setRoomSize(importedProject.roomSize);
      setSelectedWallTexture(importedProject.wallTexture);
      setSelectedFloorTexture(importedProject.floorTexture);
      setModels(importedProject.models || []);
    }
  }, []);

  const mainWallPanel = React.useMemo(() => {
    if (!wallSelectionMode || !selectedWall || !wallProps) return null;

    return (
      <WallPropertiesPanel 
        selectedWall={selectedWall}
        wallProps={wallProps}
        onWallUpdate={handleWallUpdate}
      />
    );
  }, [wallSelectionMode, selectedWall, wallProps]);

  return (
    <div className="relative flex w-screen h-screen overflow-hidden">
      {isSceneLoading && <LoadingOverlay message="Loading scene..." />}
      {refreshing && <LoadingOverlay message="Refreshing textures..." />}

      {showSidebar && (
        <Sidebar
          wallSelectionMode={wallSelectionMode}
          moveVertical={moveVertical}
          setMoveVertical={setMoveVertical}
          selectedModelIndex={selectedModelIndex}
          selectedWall={selectedWall}
          deleteSelectedModel={deleteSelectedModel}
          handleSelectTexture={handleTextureChange}
          setSelectedFloorTexture={setSelectedFloorTexture}
          selectedFloorTexture={selectedFloorTexture}
          setSelectedWallTexture={setSelectedWallTexture}
          selectedWallTexture={selectedWallTexture}
          toggleSectionCollapse={toggleSectionCollapse}
          collapsedSections={collapsedSections}
          setIsLoading={setIsLoading}
          setModels={setModels}
          setCustomWalls={undefined}
          setWallProps={handleSetWallProps}
          isRectangular={true}
          customWalls={undefined}
        />
      )}

      <div className={`flex-1 h-full relative ${!showSidebar ? 'full' : ''}`}>
        <Toolbar
          editMode={editMode}
          setEditMode={setEditMode}
          wireframeMode={wireframeMode}
          toggleWireframeMode={() => setWireframeMode(!wireframeMode)}
          showGrid={showGrid}
          toggleGrid={() => setShowGrid(!showGrid)}
          openRoomDimensionsDialog={openRoomDimensionsDialog}
          wallSelectionMode={wallSelectionMode}
          toggleSelectionMode={toggleSelectionMode}
          onBackToMenu={() => setSelectedMode(null)}
          models={models}
          roomSize={roomSize}
          wallTexture={selectedWallTexture} 
          floorTexture={selectedFloorTexture}
          customFloorTexture={null}
          plannerType="rectangular"
          onForceRefreshTextures={forceRefreshTextures}
        />

        <div className="relative w-full h-[calc(100%-50px)]">
          <Scene
            roomSize={roomSize}
            models={models}
            setModels={setModels}
            moveVertical={moveVertical}
            selectedModel={selectedModelIndex}
            setSelectedModel={handleSelectModel}
            wireframeMode={wireframeMode}
            selectedTexture={selectedTexture}
            selectedFloorTexture={selectedFloorTexture}
            selectedWallTexture={selectedWallTexture}
            editMode={editMode}
            showGrid={showGrid}
            wallSelectionMode={wallSelectionMode}
            selectedWall={selectedWall}
            setSelectedWall={handleWallSelect}
            onRoomSizeChange={(newRoomSize) => handleWallResizeRoomChange(newRoomSize, setRoomSize)}
            setWallProps={handleSetWallProps}
            setWallUpdateFunction={setWallUpdateFunction}
          />
        </div>

        {!wallSelectionMode && (
          <ObjectControls
            selectedModelIndex={selectedModelIndex}
            getSelectedModelRotation={getSelectedModelRotation}
            getSelectedModelScale={getSelectedModelScale}
            handleRotation={handleRotation}
            handleScaleChange={handleScaleChange}
          />
        )}

        {wallSelectionMode && (
          <div className={`${selectedWall !== null ? 'visible' : ''}`}>
            {mainWallPanel}
          </div>
        )}
      </div>

      {showRoomDimensionsDialog && (
        <RoomDimensionsDialog
          initialDimensions={roomSize}
          onSave={handleRoomDimensionsChange}
          onCancel={closeRoomDimensionsDialog}
        />
      )}
    </div>
  );
}

export default Planner;
