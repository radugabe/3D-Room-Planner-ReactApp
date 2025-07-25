import { useState, useEffect, useCallback, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CustomWall from "../../wall/custom/CustomWall";
import { Line, Text } from "@react-three/drei";


const SceneManager = ({
  wallCreationMode,
  customWalls,
  setCustomWalls,
  selectedWallIndex,
  setSelectedWall,
  wireframeMode,
  updateWall,
  wallsTransparent,
  wallBoxes,
  setWallBoxes
}) => {
  const { camera, raycaster, gl } = useThree();
  const [startPoint, setStartPoint] = useState(null);
  const [currentMousePos, setCurrentMousePos] = useState(null);
  const textRef = useRef();

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });

  const getPlaneIntersection = useCallback((event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x, y }, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    const intersected = raycaster.ray.intersectPlane(plane, point);
    return intersected ? [point.x, 0, point.z] : null;
  }, [camera, raycaster, gl.domElement]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMove = (event) => {
      const point = getPlaneIntersection(event);
      if (point) setCurrentMousePos(point);
    };

    const handleClick = (event) => {
      if (!wallCreationMode) return;
      if (event.button !== 0 || event.target !== canvas) return;
      const point = getPlaneIntersection(event);
      if (!point) return;

      if (!startPoint) {
        setStartPoint(point);
      } else {
        const dx = point[0] - startPoint[0];
        const dz = point[2] - startPoint[2];
        const angleRad = Math.atan2(dz, dx);
        const angleDeg = angleRad * (180 / Math.PI);

        const newWall = {
          id: `wall-${Date.now()}`,
          startPoint,
          endPoint: point,
          height: 3,
          thickness: 0.1,
          angle: angleDeg
        };

        setCustomWalls(walls => [...walls, newWall]);
        setStartPoint(null);
      }
    };

    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerdown", handleClick);

    return () => {
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerdown", handleClick);
    };
  }, [gl.domElement, getPlaneIntersection, startPoint, setCustomWalls, wallCreationMode]);

  const handleWallMove = useCallback((index, newPositions) => {
    if (updateWall) updateWall(index, newPositions);
  }, [updateWall]);

  const handleReportWallBox = (index, box) => {
    setWallBoxes(prev => {
      const updated = [...prev];
      updated[index] = box;
      return updated;
    });
  };

  return (
    <>
      {customWalls.map((wall, index) => (
        <CustomWall 
          key={wall.id || `wall-${index}`}
          wall={wall}
          index={index}
          isSelected={selectedWallIndex === index}
          onSelect={setSelectedWall}
          wireframeMode={wireframeMode}
          onMove={handleWallMove}
          wallCreationMode={wallCreationMode}
          wallsTransparent={wallsTransparent}
          reportWallBox={handleReportWallBox}
        />
      ))}

      {startPoint && currentMousePos && (
        <>
          <mesh
            position={[
              (startPoint[0] + currentMousePos[0]) / 2,
              1.5,
              (startPoint[2] + currentMousePos[2]) / 2
            ]}
            rotation={[0, Math.atan2(
              currentMousePos[0] - startPoint[0],
              currentMousePos[2] - startPoint[2]
            ), 0]}
          >
            <boxGeometry args={[0.1, 3, Math.hypot(
              currentMousePos[0] - startPoint[0],
              currentMousePos[2] - startPoint[2]
            )]} />
            <meshStandardMaterial color="gray" transparent opacity={0.5} />
          </mesh>

          <Line
            points={[
              new THREE.Vector3(...startPoint),
              new THREE.Vector3(...currentMousePos)
            ]}
            color="orange"
            lineWidth={2}
            dashed={false}
          />

          <Text
            ref={textRef}
            position={[
              (startPoint[0] + currentMousePos[0]) / 2,
              0.2,
              (startPoint[2] + currentMousePos[2]) / 2
            ]}
            fontSize={0.25}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {(
              Math.sqrt(
                Math.pow(currentMousePos[0] - startPoint[0], 2) +
                Math.pow(currentMousePos[2] - startPoint[2], 2)
              ).toFixed(2)
            )} m
          </Text>
        </>
      )}
    </>
  );
};

export default SceneManager;