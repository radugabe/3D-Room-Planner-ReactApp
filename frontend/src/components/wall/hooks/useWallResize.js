import { useCallback } from "react";
import * as THREE from "three";

export function useWallResize({ ref, wallProps, isSelected, onSelect, onResize, roomSize }) {
  const { position, rotation, size, name } = wallProps;

  const getMousePosition = useCallback((event, camera) => {
    const vector = new THREE.Vector3(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    vector.unproject(camera);
    vector.sub(camera.position).normalize();

    const plane = new THREE.Plane();
    const normal = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(...rotation));
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(...position));

    const ray = new THREE.Ray(camera.position, vector);
    const targetPos = new THREE.Vector3();
    ray.intersectPlane(plane, targetPos);

    return targetPos;
  }, [position, rotation]);

  const detectEdge = useCallback((event, camera) => {
    if (!ref.current) return null;

    const mousePos = getMousePosition(event, camera);
    const localPos = mousePos.clone().sub(new THREE.Vector3(...position));

    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation)).invert();
    localPos.applyMatrix4(rotationMatrix);

    const halfWidth = size[0] / 2;
    const halfHeight = size[1] / 2;
    const edgeThreshold = 0.2;

    if (Math.abs(localPos.x - halfWidth) < edgeThreshold) return "right";
    if (Math.abs(localPos.x + halfWidth) < edgeThreshold) return "left";
    if (Math.abs(localPos.y - halfHeight) < edgeThreshold) return "top";
    if (Math.abs(localPos.y + halfHeight) < edgeThreshold) return "bottom";

    return null;
  }, [position, rotation, size]);

  const handlePointerDown = useCallback((event, camera) => {
    if (event.button === 0) {
      event.stopPropagation();
      const edge = detectEdge(event, camera);
      if (!edge && onSelect) {
        onSelect(name);
      }
    }
  }, [detectEdge, name, onSelect]);

  const attachEventListeners = useCallback((
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
  ) => {
    const handlePointerMove = (event) => {
      if (!ref.current) return;
      if (dragStartPos) {
      } else {
        const edge = detectEdge(event, camera);
        setHoveredEdge(edge);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragStartPos(null);
      document.body.style.cursor = "default";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [ref, detectEdge]);

  return { attachEventListeners, handlePointerDown };
}
