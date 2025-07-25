import { useState, useEffect, useContext } from "react";

import { AppContext } from "../App";
import { SCENE } from "../utils/Constants";
import LoadingOverlay from "../components/common/LoadingOverlay";
import Sidebar from "../components/layout/Sidebar";
import Toolbar from "../components/layout/Toolbar";
import CustomScene from "../components/view/custom/CustomScene";
import CustomWallPropertiesPanel from "../components/wall/custom/CustomWallPropertiesPanel";
import ObjectControls from "../components/controls/ObjectControls";

import useModelManager from "../hooks/useModelManager";
import useTextureManager from "../hooks/useTextureManager";
import useToolbarManager from "../hooks/useToolbarManager";
import useCustomWallManager from "../hooks/useCustomWallManager";
import { useTextureRefresh } from "../hooks/useTextureRefresh";

const CustomPlanner = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Inițializare...");
  const [moveVertical, setMoveVertical] = useState(false);
  const [roomSize, setRoomSize] = useState(SCENE.DEFAULT_ROOM_SIZE);
  const [showSidebar, setShowSidebar] = useState(true);
  const { setSelectedMode, importedProject } = useContext(AppContext);
  const [wallsTransparent, setWallsTransparent] = useState(false);

  const {
    editMode,
    setEditMode,
    wireframeMode,
    toggleWireframeMode,
    showGrid,
    toggleGrid
  } = useToolbarManager();

  const {
    models,
    setModels,
    selectedModelIndex,
    setSelectedModelIndex,
    deleteSelectedModel,
    getSelectedModelScale,
    getSelectedModelRotation,
    handleRotation,
    handleScaleChange
  } = useModelManager();

  const {
    selectedTexture,
    setSelectedTexture,
    selectedFloorTexture,
    setSelectedFloorTexture,
    selectedWallTexture,
    setSelectedWallTexture,
    handleSelectTexture
  } = useTextureManager();

  const {
    customWalls,
    setCustomWalls,
    selectedWallIndex,
    setSelectedWallIndex,
    wallCreationMode,
    toggleWallCreationMode,
    handleWallUpdate,
    handleCustomWallsUpdate
  } = useCustomWallManager();

  const { forceRefreshTextures, refreshing } = useTextureRefresh(models, setSelectedModelIndex);

  useEffect(() => {
    if (wallCreationMode) {
      setSelectedModelIndex(null);
    }
  }, [wallCreationMode]);

  useEffect(() => {
    const initScene = async () => {
      setLoading(true);
      setLoadingMessage("Pregătire scenă...");
      setTimeout(() => setLoading(false), 500);
    };
    initScene();
  }, []);

  useEffect(() => {
    if (
      selectedWallIndex !== null &&
      customWalls[selectedWallIndex]?.texture !== selectedWallTexture
    ) {
      setSelectedWallTexture(customWalls[selectedWallIndex]?.texture || null);
    }
  }, [selectedWallIndex, customWalls, selectedWallTexture]);

  useEffect(() => {
    if (selectedWallIndex === null && selectedWallTexture) {
      setSelectedWallTexture(null);
    }
  }, [selectedWallIndex, selectedWallTexture]);

  useEffect(() => {
    if (importedProject) {
      if (Array.isArray(importedProject.models)) {
        setModels(importedProject.models);
      }
      if (Array.isArray(importedProject.walls)) {
        setCustomWalls(importedProject.walls);
      }
      if (importedProject.floorTexture) {
        setSelectedFloorTexture(importedProject.floorTexture);
      }
    }
  }, []);

  const toggleWallsTransparency = () => {
    setWallsTransparent(prev => !prev);
  };

  const handleTextureChange = (texturePath) => {
    if (selectedModelIndex !== null) {
      const updated = [...models];
      updated[selectedModelIndex] = {
        ...updated[selectedModelIndex],
        texturePath
      };
      setModels(updated);
    }
  };

  const handleSelectModel = (index) => {
    setSelectedModelIndex(index);
    setSelectedWallIndex(null);
    setSelectedTexture(null);
  };  

  const handleSelectWall = (index) => {
    setSelectedWallIndex(index);
    setSelectedModelIndex(null);
  };  

  const handleFloorTextureChange = (texturePath) => setSelectedFloorTexture(texturePath);
  const handleWallTextureChange = (texturePath) => {
    if (selectedWallIndex !== null) {
      const updated = [...customWalls];
      updated[selectedWallIndex] = {
        ...updated[selectedWallIndex],
        texture: texturePath
      };
      setCustomWalls(updated);
    }
    setSelectedWallTexture(texturePath);
  };

  return (
    <div className="relative flex w-screen h-screen overflow-hidden">
      {loading && <LoadingOverlay message={loadingMessage} />}
      {refreshing && <LoadingOverlay message="Refreshing textures..." />}

      {showSidebar && (
        <Sidebar
          wallSelectionMode={wallCreationMode}
          moveVertical={moveVertical}
          setMoveVertical={setMoveVertical}
          selectedModelIndex={selectedModelIndex}
          selectedWall={selectedWallIndex}
          deleteSelectedModel={deleteSelectedModel}
          handleSelectTexture={handleTextureChange}
          setSelectedFloorTexture={handleFloorTextureChange}
          selectedFloorTexture={selectedFloorTexture}
          setSelectedWallTexture={handleWallTextureChange}
          selectedWallTexture={selectedWallTexture}
          toggleSectionCollapse={() => {}}
          collapsedSections={{}}
          setIsLoading={setLoading}
          setModels={setModels}
          setCustomWalls={setCustomWalls} 
          isRectangular={false}
          customWalls={customWalls}
        />
      )}

      <div className={`flex-1 h-full relative ${!showSidebar ? "full" : ""}`}>
        <Toolbar
          editMode={editMode}
          setEditMode={setEditMode}
          wireframeMode={wireframeMode}
          toggleWireframeMode={toggleWireframeMode}
          showGrid={showGrid}
          toggleGrid={toggleGrid}
          wallSelectionMode={wallCreationMode}
          toggleSelectionMode={toggleWallCreationMode}
          onBackToMenu={() => setSelectedMode(null)}
          wallsTransparent={wallsTransparent}
          toggleWallsTransparency={toggleWallsTransparency}
          walls={customWalls}
          models={models}
          floorTexture={null}
          customFloorTexture={selectedFloorTexture}
          plannerType="custom"
          onForceRefreshTextures={forceRefreshTextures}
        />

        <div className="relative w-full h-[calc(100%-50px)]">
          <CustomScene
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
            customWalls={customWalls}
            setCustomWalls={setCustomWalls}
            selectedWallIndex={selectedWallIndex}
            setSelectedWall={handleSelectWall}
            wallCreationMode={wallCreationMode}
            updateWall={handleWallUpdate}
            wallsTransparent={wallsTransparent}
          />
          {!wallCreationMode && selectedModelIndex !== null && (
            <ObjectControls
              selectedModelIndex={selectedModelIndex}
              getSelectedModelRotation={getSelectedModelRotation}
              getSelectedModelScale={getSelectedModelScale}
              handleRotation={handleRotation}
              handleScaleChange={handleScaleChange}
            />
          )}
          <div className={`${selectedWallIndex !== null ? "visible" : ""}`}>
            {selectedWallIndex !== null && (
              <CustomWallPropertiesPanel
                selectedWall={customWalls[selectedWallIndex]}
                selectedWallIndex={selectedWallIndex}
                customWalls={customWalls}
                onWallUpdate={handleCustomWallsUpdate}
                onDeselectWall={() => setSelectedWallIndex(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlanner;