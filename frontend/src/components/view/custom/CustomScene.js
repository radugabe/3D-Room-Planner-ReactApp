import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import SelectableModel from "../../model/SelectableModel";
import useFloorTextureLoader from "../../../hooks/useFloorTextureLoader";
import useOrbitPanToggle from "../../../hooks/useOrbitPanToggle";

import SceneManager from "./SceneManager";
import SceneLights from "./SceneLights";
import FloorGrid from "./FloorGrid";
import Floor from "./Floor";

const CustomScene = ({
  roomSize,
  models = [],
  setModels,
  moveVertical = false,
  selectedModel,
  setSelectedModel,
  wireframeMode = false,
  selectedTexture,
  selectedFloorTexture,
  editMode = 'move',
  showGrid = true,
  customWalls = [],
  setCustomWalls,
  selectedWallIndex,
  setSelectedWall,
  wallCreationMode = false,
  updateWall,
  wallsTransparent
}) => {
  const floorTexture = useFloorTextureLoader(selectedFloorTexture);
  const [wallBoxes, setWallBoxes] = useState([]);
  const orbitRef = useRef();
  useOrbitPanToggle(orbitRef);

  useEffect(() => {
    if (models.some(item => !item.uniqueId)) {
      const updatedModels = models.map(item => !item.uniqueId
        ? { ...item, uniqueId: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
        : item);
      setModels(updatedModels);
    }
  }, [models, setModels]);

  const handleBackgroundClick = useCallback((event) => {
    if (event.object === undefined) {
      setSelectedModel(null);
      setSelectedWall(null);
    }
  }, [setSelectedModel, setSelectedWall]);

  const glAttributes = useMemo(() => ({
    antialias: true,
    powerPreference: "high-performance",
    alpha: false,
    stencil: false,
    depth: true
  }), []);

  const performanceSettings = useMemo(() => ({ min: 0.5 }), []);

  const handleCreated = useCallback(({ gl, scene }) => {
    gl.setClearColor('#ffffff');
    scene.background = new THREE.Color('#ffffff');
    gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  }, []);

  return (
    <Canvas
      camera={{ position: [-5, 5, 10], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={handleBackgroundClick}
      shadows={false}
      gl={glAttributes}
      performance={performanceSettings}
      onCreated={handleCreated}
      frameloop="demand"
      onWheel={(e) => e.preventDefault()}
    >
      <SceneLights />
      <FloorGrid roomSize={roomSize} visible={showGrid} />
      <Floor width={18} depth={15} texture={floorTexture} wireframeMode={wireframeMode} />

      <SceneManager
        wallCreationMode={wallCreationMode}
        customWalls={customWalls}
        setCustomWalls={setCustomWalls}
        selectedWallIndex={selectedWallIndex}
        setSelectedWall={setSelectedWall}
        wireframeMode={wireframeMode}
        updateWall={updateWall}
        wallsTransparent={wallsTransparent}
        wallBoxes={wallBoxes}
        setWallBoxes={setWallBoxes}
      />

      {models.map((item, index) => (
        <SelectableModel
          key={item.uniqueId || `item-${index}`}
          item={item}
          index={index}
          setModels={setModels}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          roomSize={roomSize}
          moveVertical={moveVertical}
          texturePath={selectedModel === index ? selectedTexture : item.texturePath}
          editMode={editMode}
          restrictToRoom={false}
          wallBoxes={wallBoxes}
        />
      ))}

      <OrbitControls
        ref={orbitRef}
        makeDefault
        enableRotate={true}
        enableZoom={true}
        enablePan={false}
        mouseButtons={{
          LEFT: THREE.MOUSE.RIGHT,
          RIGHT: THREE.MOUSE.LEFT
        }}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minDistance={1}
        maxDistance={100}
      />
    </Canvas>
  );
};

export default CustomScene;
