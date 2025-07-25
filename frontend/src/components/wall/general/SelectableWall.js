import React, { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";

import { useWallResize } from "../hooks/useWallResize";
import { useWallMaterial } from "../hooks/useWallMaterial";

const SelectableWall = ({ 
  wallProps, 
  isSelected, 
  onSelect, 
  onResize,
  roomSize,
  wallTexture,
  wireframeMode 
}) => {
  const { position, rotation, size, name, color = "#ffffff" } = wallProps;

  const ref = useRef();
  const { camera } = useThree();

  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);
  const [originalSize, setOriginalSize] = useState(size);
  const [originalPosition, setOriginalPosition] = useState(position);

  const material = useWallMaterial({ color, wallTexture, wireframeMode, isSelected });

  const { attachEventListeners, handlePointerDown } = useWallResize({
    ref,
    wallProps,
    isSelected,
    onSelect,
    onResize,
    roomSize
  });

  useEffect(() => {
    const cleanup = attachEventListeners(
      camera,
      setHoveredEdge,
      setIsDragging,
      setDragStartPos,
      setOriginalSize,
      setOriginalPosition,
      hoveredEdge,
      dragStartPos,
      originalSize,
      originalPosition
    );
    return cleanup;
  }, [
    attachEventListeners,
    camera,
    hoveredEdge,
    dragStartPos,
    originalSize,
    originalPosition
  ]);

  const getEdgeHighlight = (edge) => {
    if (hoveredEdge === edge || (isDragging && hoveredEdge === edge)) {
      return "#ffff00";
    }
    return "transparent";
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={ref} onPointerDown={(e) => handlePointerDown(e, camera)}>
        <planeGeometry args={size} />
        <primitive object={material.current} />
      </mesh>
    </group>
  );
};

export default React.memo(SelectableWall);