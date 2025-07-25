import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Room from "../../room/Room";
import SelectableModel from "../../model/SelectableModel";
import SceneLights from "./SceneLights";
import FloorGrid from "./FloorGrid";
import useOrbitPanToggle from "../../../hooks/useOrbitPanToggle";


const Scene = ({
  roomSize,
  models,
  setModels,
  moveVertical = false,
  selectedModel,
  setSelectedModel,
  wireframeMode,
  selectedTexture,
  selectedFloorTexture,
  selectedWallTexture,
  editMode = 'move',
  showGrid = true,
  wallSelectionMode = false,
  selectedWall,
  setSelectedWall,
  onRoomSizeChange,
  setWallProps,
  setWallUpdateFunction
}) => {
  const orbitRef = useRef();
  useOrbitPanToggle(orbitRef);
  
  useEffect(() => {
    if (models.some(item => !item.uniqueId)) {
      const updatedModels = models.map(item => {
        if (!item.uniqueId) {
          return {
            ...item,
            uniqueId: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };
        }
        return item;
      });
      setModels(updatedModels);
    }
  }, [models, setModels]);

  const handleBackgroundClick = useCallback(() => {
    if (wallSelectionMode) {
      setTimeout(() => setSelectedWall(null), 0);
    } else {
      setTimeout(() => setSelectedModel(null), 0);
    }
  }, [setSelectedModel, setSelectedWall, wallSelectionMode]);

  const handleWallSelect = useCallback((wallName) => {
    setSelectedWall(wallName);
  }, [setSelectedWall]);

  const handleRoomSizeChange = useCallback((newRoomSize) => {
    if (onRoomSizeChange) {
      onRoomSizeChange(newRoomSize);
    }
  }, [onRoomSizeChange]);

  const glAttributes = useMemo(() => ({
    antialias: true,
    powerPreference: "high-performance",
    alpha: false,
    stencil: false,
    depth: true
  }), []);

  const performanceSettings = useMemo(() => ({
    min: 0.5
  }), []);

  const handleCreated = useCallback(({ gl, scene }) => {
    gl.setClearColor('#ffffff');
    scene.background = new THREE.Color('#ffffff');
    gl.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  }, []);

  const handleModelLoaded = (modelId) => {
    setModels(prev => {
      const updated = [...prev];
      const index = updated.findIndex(m => m.id === modelId);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          __loaded: true
        };
      }
      return updated;
    });
  };

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
    >
      <SceneLights />
      <FloorGrid roomSize={roomSize} visible={showGrid} />

      <Room
        width={roomSize.width}
        height={roomSize.height}
        depth={roomSize.depth}
        wireframeMode={wireframeMode}
        selectedFloorTexture={selectedFloorTexture}
        selectedWallTexture={selectedWallTexture}
        wallSelectionMode={wallSelectionMode}
        onWallSelect={handleWallSelect}
        selectedWall={selectedWall}
        onRoomSizeChange={handleRoomSizeChange}
        onWallPropsUpdate={setWallProps}
        setWallUpdateFunction={setWallUpdateFunction}
        key={`room-${selectedFloorTexture}-${selectedWallTexture}-${wallSelectionMode}-${selectedWall}-${roomSize.width}-${roomSize.height}-${roomSize.depth}`}
      />

      {models.map((item, index) => {
        const shouldApplySelectedTexture = selectedModel === index;
        const textureToApply = shouldApplySelectedTexture ? selectedTexture : item.texturePath;

        console.log("🧪 Model", index, {
          selectedModel,
          selectedTexture,
          itemTexturePath: item.texturePath,
          textureToApply,
        });

        return (
          <SelectableModel
            key={item.uniqueId || `model-${index}`}
            item={item}
            index={index}
            setModels={setModels}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            roomSize={roomSize}
            moveVertical={moveVertical}
            texturePath={selectedModel === index ? selectedTexture : item.texturePath}
            editMode={editMode}
            onLoaded={handleModelLoaded}
          />
        );
      })}

      <OrbitControls 
        ref={orbitRef}
        makeDefault
        enableRotate 
        enableZoom 
        enablePan={false} 
        mouseButtons={{ LEFT: 2, RIGHT: 0, MIDDLE: 1 }}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minDistance={1}
        maxDistance={40}
      />
    </Canvas>
  );

};

export default Scene;
