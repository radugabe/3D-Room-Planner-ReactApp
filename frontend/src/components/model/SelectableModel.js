import { useRef, useState, useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Text } from '@react-three/drei';

import { createModelOBB } from '../../utils/CollisionUtils';
import { useModelLoader } from "./hooks/useModelLoader";
import { useModelTextureUpdater } from "./hooks/useModelTextureUpdater";
import { useGlobalPointerEvents } from "./hooks/useGlobalPointerEvents";

const SelectableModel = ({
  item,
  index,
  setModels,
  selectedModel,
  setSelectedModel,
  roomSize,
  moveVertical,
  texturePath,
  editMode = 'move',
  restrictToRoom = true,
  wallBoxes = [],
  onLoaded
}) => {
  const ref = useRef();
  const { camera } = useThree();
  const [position, setPosition] = useState(item.position);
  const [rotation, setRotation] = useState(item.rotation || [0, 0, 0]);
  const [scale, setScale] = useState(item.scale || { x: 1, y: 1, z: 1 });
  const dragStartPos = useRef({ mouse: new THREE.Vector3(), model: new THREE.Vector3() });
  const dragStartRot = useRef([0, 0, 0]);
  const dragStartScale = useRef({ x: 1, y: 1, z: 1 });
  const isDragging = useRef(false);
  const activeDragMode = useRef(null);
  const currentItemId = useRef(item.id);
  const isSelected = selectedModel === index;
  const lastValidPosition = useRef(position);
  const [verticalMovePos, setVerticalMovePos] = useState(null);
  
  const applyHighlighting = useCallback((selected) => {
    if (!modelRef.current) return;

    modelRef.current.scene.traverse(node => {
      if (node.isMesh) {
        if (!node.material._isCloned) {
          node.material = node.material.clone();
          node.material._isCloned = true;
        }
        if (selected) {
          node.material.emissive = new THREE.Color(0xb07a36);
          node.material.emissiveIntensity = 0.2;
          node.material.transparent = true;
          node.material.opacity = 0.8;
        } else {
          node.material.emissive = new THREE.Color(0x000000);
          node.material.emissiveIntensity = 0;
          node.material.transparent = false;
          node.material.opacity = 1;
        }
      }
    });
    const invalidate = require('@react-three/fiber').invalidate;
    invalidate();
  }, []);

  const { modelRef, loadedModel } = useModelLoader(
    item.modelPath,
    item.id,
    isSelected,
    position,
    applyHighlighting
  );

  useModelTextureUpdater({
    modelRef,
    isSelected,
    texturePath,
    itemTexturePath: item.texturePath,
    applyHighlighting,
    setModels,
    index
  });

  const getMousePosition = useCallback((event, planeType) => {
    const vector = new THREE.Vector3(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );

    vector.unproject(camera);
    vector.sub(camera.position).normalize();

    const ray = new THREE.Ray(camera.position, vector);
    const plane = new THREE.Plane();

    if (planeType === "XZ") {
      plane.set(new THREE.Vector3(0, 1, 0), -position[1]);
    } else if (planeType === "Y") {
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      plane.setFromNormalAndCoplanarPoint(cameraDirection, new THREE.Vector3(...position));
    }

    const targetPos = new THREE.Vector3();
    ray.intersectPlane(plane, targetPos);
    return targetPos;
  }, [camera, position]);

  const getObjectDimensions = useCallback(() => {
    if (!modelRef.current) return {
      width: 1, height: 1, depth: 1,
      min: new THREE.Vector3(), max: new THREE.Vector3()
    };
  
    const tempObject = new THREE.Object3D();
    const clonedScene = modelRef.current.scene.clone();
    clonedScene.scale.set(scale.x, scale.y, scale.z);
    tempObject.add(clonedScene);
  
    const box = new THREE.Box3().setFromObject(tempObject);
    const size = box.getSize(new THREE.Vector3());
    const min = box.min.clone();
    const max = box.max.clone();
  
    tempObject.remove(clonedScene);
  
    return { width: size.x, height: size.y, depth: size.z, min, max, box };
  }, [scale]);

  const handleMoveMode = useCallback((currentPos) => {
    const diff = currentPos.clone().sub(dragStartPos.current.mouse);
    let newX = dragStartPos.current.model.x;
    let newY = dragStartPos.current.model.y;
    let newZ = dragStartPos.current.model.z;
    if (moveVertical) {
      setVerticalMovePos([position[0], newY, position[2]]);
    } else {
      setVerticalMovePos(null);
    }
    const dimensions = getObjectDimensions();

    let proposedX, proposedY, proposedZ;

    if (moveVertical) {
      proposedY = dragStartPos.current.model.y + diff.y;

      const tempObject = new THREE.Object3D();
      const sceneClone = modelRef.current.scene.clone();
      sceneClone.scale.set(scale.x, scale.y, scale.z);
      tempObject.add(sceneClone);
      tempObject.position.set(position[0], proposedY, position[2]);

      const movedBox = new THREE.Box3().setFromObject(tempObject);
      const minY = movedBox.min.y;
      const maxY = movedBox.max.y;

      if (minY >= 0 && maxY <= roomSize.height) {
        newY = proposedY;
      } else if (minY < 0) {
        newY = proposedY - minY;
      } else if (maxY > roomSize.height) {
        newY = proposedY - (maxY - roomSize.height);
      }

      tempObject.remove(sceneClone);
    } else {
      proposedX = dragStartPos.current.model.x + diff.x;
      proposedZ = dragStartPos.current.model.z + diff.z;

      const tempObject = new THREE.Object3D();
      const sceneClone = modelRef.current.scene.clone();
      sceneClone.scale.set(scale.x, scale.y, scale.z);
      tempObject.add(sceneClone);
      tempObject.position.set(proposedX, position[1], proposedZ);
      tempObject.updateMatrixWorld(true);
      const movedBox = new THREE.Box3().setFromObject(tempObject);
      const box = new THREE.Box3().setFromObject(sceneClone);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const movedOBB = createModelOBB(
        [center.x, center.y, center.z],
        rotation,
        { x: 1, y: 1, z: 1 },
        size
      );

      const collides = wallBoxes.some(wallOBB => {
        if (!wallOBB) return false;
        return movedOBB.intersectsOBB(wallOBB);
      });

      if (collides) {
        setPosition(lastValidPosition.current);
        updateModelsState(lastValidPosition.current, rotation, scale);
        tempObject.remove(sceneClone);
        return;
      }

      const minX = movedBox.min.x;
      const maxX = movedBox.max.x;
      const minZ = movedBox.min.z;
      const maxZ = movedBox.max.z;

      if (restrictToRoom) {
        if (minX >= -roomSize.width / 2 && maxX <= roomSize.width / 2) {
          newX = proposedX;
        } else if (minX < -roomSize.width / 2) {
          newX = proposedX - (minX + roomSize.width / 2);
        } else if (maxX > roomSize.width / 2) {
          newX = proposedX - (maxX - roomSize.width / 2);
        }

        if (minZ >= -roomSize.depth / 2 && maxZ <= roomSize.depth / 2) {
          newZ = proposedZ;
        } else if (minZ < -roomSize.depth / 2) {
          newZ = proposedZ - (minZ + roomSize.depth / 2);
        } else if (maxZ > roomSize.depth / 2) {
          newZ = proposedZ - (maxZ - roomSize.depth / 2);
        }
      } else {
        newX = proposedX;
        newZ = proposedZ;
      }

      tempObject.remove(sceneClone);
    }

    const newPosition = [newX, newY, newZ];
    lastValidPosition.current = newPosition;
    setPosition(newPosition);
    updateModelsState(newPosition, rotation, scale);
  }, [roomSize, scale, rotation, moveVertical, getObjectDimensions, position, wallBoxes, restrictToRoom]);

  const handleRotateMode = useCallback((currentPos) => {
    const diff = currentPos.clone().sub(dragStartPos.current.mouse);
    const rotationSensitivity = 1.0;
    let newRotation = [...dragStartRot.current];
    newRotation[1] = dragStartRot.current[1] - diff.x * rotationSensitivity;
    setRotation(newRotation);
    updateModelsState(position, newRotation, scale);
  }, [position, scale]);

  const handleScaleMode = useCallback((currentPos) => {
    const diff = currentPos.clone().sub(dragStartPos.current.mouse);
    const scaleSensitivity = 1.0;
    const scaleFactor = 1 + (diff.x + diff.z) * scaleSensitivity / 10;
    let newScale = { ...dragStartScale.current };
    newScale.x = Math.max(0.1, dragStartScale.current.x * scaleFactor);
    newScale.y = Math.max(0.1, dragStartScale.current.y * scaleFactor);
    newScale.z = Math.max(0.1, dragStartScale.current.z * scaleFactor);
    setScale(newScale);
    updateModelsState(position, rotation, newScale);
  }, [position, rotation]);

  const handlePointerDown = useCallback((e) => {
    if (e.button === 0) {
      e.stopPropagation();
      setSelectedModel(index);
      activeDragMode.current = editMode;
      isDragging.current = true;
      dragStartPos.current.mouse = getMousePosition(e, moveVertical ? "Y" : "XZ");
      dragStartPos.current.model.set(...position);
      dragStartRot.current = [...rotation];
      dragStartScale.current = { ...scale };
    }
  }, [getMousePosition, index, moveVertical, position, rotation, scale, setSelectedModel, editMode]);

  const handleGlobalPointerMove = useCallback((e) => {
    if (!isDragging.current || selectedModel !== index) return;
    const useVerticalPlane = moveVertical && activeDragMode.current === 'move';
    const currentPos = getMousePosition(e, useVerticalPlane ? "Y" : "XZ");
    switch (activeDragMode.current) {
      case 'move': handleMoveMode(currentPos); break;
      case 'rotate': handleRotateMode(currentPos); break;
      case 'scale': handleScaleMode(currentPos); break;
      default: isDragging.current = false;
    }
  }, [getMousePosition, moveVertical, selectedModel, index]);

  const handleGlobalPointerUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      activeDragMode.current = null;
      setVerticalMovePos(null);
    }
  }, []);

  const updateModelsState = useCallback((newPosition, newRotation, newScale) => {
    setModels(prev => {
      const newModels = [...prev];
      if (index < newModels.length) {
        newModels[index] = {
          ...newModels[index],
          id: currentItemId.current,
          position: newPosition,
          rotation: newRotation,
          scale: newScale,
          texturePath: newModels[index].texturePath,
          uniqueId: item.uniqueId || newModels[index].uniqueId
        };
      }
      return newModels;
    });
  }, [setModels, index, item.uniqueId]);

  useGlobalPointerEvents(handleGlobalPointerMove, handleGlobalPointerUp);

  useEffect(() => {
    if (!item.uniqueId) {
      setModels(prev => {
        const newModels = [...prev];
        if (index < newModels.length) {
          newModels[index] = {
            ...newModels[index],
            uniqueId: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };
        }
        return newModels;
      });
    }
  }, []);

  useEffect(() => {
    if (!isDragging.current) {
      setPosition(item.position);
      setRotation(item.rotation || [0, 0, 0]);
      setScale(item.scale || { x: 1, y: 1, z: 1 });
    }
  }, [item.position, item.rotation, item.scale]);

  useEffect(() => {
    if (modelRef.current) {
      applyHighlighting(isSelected);
    }
  }, [isSelected, applyHighlighting]);

  useEffect(() => {
    if (loadedModel?.scene && scale) {
      loadedModel.scene.scale.set(scale.x, scale.y, scale.z);

      setModels(prev => {
        const newModels = [...prev];
        if (index < newModels.length) {
          newModels[index] = {
            ...newModels[index],
            __loaded: true
          };
        }
        return newModels;
      });

      onLoaded?.(item.id);
    }
  }, [loadedModel, scale]);

  if (!modelRef.current) {
    return (
      <mesh
        position={position}
        rotation={rotation}
        scale={[scale.x, scale.y, scale.z]}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cccccc" opacity={0.5} transparent={true} />
      </mesh>
    );
  }

  const currentHeight = position[1];

  return (
    <>
      <group ref={ref} position={position} rotation={rotation}>
        <primitive 
          object={modelRef.current.scene} 
          scale={[scale.x, scale.y, scale.z]}
          onPointerDown={handlePointerDown} 
        />
      </group>

      {moveVertical && isSelected && (
        
        <>
          <Line
            points={[
              [position[0], 0, position[2]],
              [position[0], currentHeight, position[2]]
            ]}
            color="orange"
            lineWidth={2}
          />
          <Text
            position={[
              position[0] + 0.15,
              currentHeight / 2,
              position[2]
            ]}
            fontSize={0.25}
            color="black"
            anchorX="left"
            anchorY="middle"
            rotation={[0, camera.rotation.y, 0]}
          >
            {`${currentHeight.toFixed(2)} m`}
          </Text>
        </>
      )}
    </>
  );
};

export default SelectableModel;