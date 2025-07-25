import React, { useState, useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createWallOBB } from "../../../utils/CollisionUtils";
import { useWallTextureLoader } from "../hooks/useWallTextureLoader";

const CustomWall = ({
  wall,
  isSelected,
  onSelect,
  index,
  wireframeMode,
  onMove,
  wallCreationMode,
  wallsTransparent,
  reportWallBox
}) => {
  const { camera, raycaster, gl } = useThree();
  const meshRef = useRef();
  const texture = useWallTextureLoader(wall.texture);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ mouse: new THREE.Vector3(), wall: new THREE.Vector3() });
  const startPoint = new THREE.Vector3(...wall.startPoint);
  const endPoint = new THREE.Vector3(...wall.endPoint);
  const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
  const length = direction.length();
  const center = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);

  let angle;
  if (wall.angle !== undefined) {
    angle = (wall.angle * Math.PI) / 180;
  } else {
    angle = Math.atan2(direction.z, direction.x);
  }

  const material = useRef(new THREE.MeshStandardMaterial({
    color: "#ffffff",
    wireframe: wireframeMode,
    roughness: 0.9,
    metalness: 0
  }));

  useEffect(() => {
    if (texture) {
      material.current.map = texture;
    } else {
      material.current.map = null;
      material.current.color.set("#ffffff");
    }
    material.current.wireframe = wireframeMode;
    material.current.transparent = wallsTransparent;
    material.current.opacity = wallsTransparent ? 0.4 : 1;
    material.current.needsUpdate = true;
  }, [texture, wireframeMode, wallsTransparent]);

  useEffect(() => {
    if (isSelected) {
      material.current.emissive.set(0xb07a36);
      material.current.emissiveIntensity = 0.2;
    } else {
      material.current.emissive.set(0x000000);
      material.current.emissiveIntensity = 0;
    }
    material.current.needsUpdate = true;
  }, [isSelected]);

  useEffect(() => {
    if (typeof reportWallBox === "function") {
      const start = new THREE.Vector3(...wall.startPoint);
      const end = new THREE.Vector3(...wall.endPoint);
      const obb = createWallOBB(start, end, wall.height, wall.thickness, wall.angle || 0);
      reportWallBox(index, obb);
    }
  }, [wall.startPoint, wall.endPoint, wall.height, wall.thickness, wall.angle]);

  useEffect(() => {
    return () => {
      if (typeof reportWallBox === "function") {
        reportWallBox(index, null);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.raycast = wallsTransparent ? () => {} : THREE.Mesh.prototype.raycast;
    }
  }, [wallsTransparent]);

  const getMousePositionOnPlane = (event) => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
    raycaster.setFromCamera({ x, y }, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ray = new THREE.Ray(camera.position, raycaster.ray.direction);
    const planeIntersectPoint = new THREE.Vector3();
    const hasIntersection = ray.intersectPlane(plane, planeIntersectPoint);
    return hasIntersection ? planeIntersectPoint : null;
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0 || wallCreationMode) return;
    event.stopPropagation();

    if (!wallsTransparent) {
      onSelect(index);
      const mousePos = getMousePositionOnPlane(event);
      if (mousePos) {
        dragStartPos.current.mouse = mousePos.clone();
        dragStartPos.current.wall = center.clone();
      }

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
  };

  const handlePointerMove = (event) => {
    const currentPos = getMousePositionOnPlane(event);
    if (!currentPos || !dragStartPos.current.mouse) return;

    if (!isDragging) {
      setIsDragging(true);
    }

    const diff = new THREE.Vector3().subVectors(currentPos, dragStartPos.current.mouse);
    const newStartX = startPoint.x + diff.x;
    const newStartZ = startPoint.z + diff.z;
    const newEndX = endPoint.x + diff.x;
    const newEndZ = endPoint.z + diff.z;

    if (onMove) {
      onMove(index, {
        startPoint: [newStartX, 0, newStartZ],
        endPoint: [newEndX, 0, newEndZ]
      });
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[center.x, wall.height / 2, center.z]}
        rotation={[0, -angle, 0]}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[length, wall.height, wall.thickness]} />
        <primitive object={material.current} />
      </mesh>
    </group>
  );
};

export default React.memo(CustomWall);