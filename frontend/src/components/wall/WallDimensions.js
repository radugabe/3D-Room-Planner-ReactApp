import React, { useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const WallDimensions = ({ wall, isSelected }) => {
  const startPoint = new THREE.Vector3(...wall.startPoint);
  const endPoint = new THREE.Vector3(...wall.endPoint);
  const center = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
  
  const length = startPoint.distanceTo(endPoint);

  let angle;
  if (wall.angle !== undefined) {
    angle = wall.angle;
  } else {
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
    const angleRad = Math.atan2(direction.z, direction.x);
    angle = (angleRad * 180 / Math.PI).toFixed(1);
  }

  if (!isSelected) return null;
  
  return (
    <Html position={[center.x, wall.height / 2, center.z]}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        transform: 'translate3d(-50%, -50%, 0)',
        fontFamily: 'Arial'
      }}>
        <div style={{ marginBottom: '3px' }}>Length: {length.toFixed(2)}m</div>
        <div style={{ marginBottom: '3px' }}>Height: {wall.height.toFixed(2)}m</div>
        <div>Angle: {angle}°</div>
      </div>
    </Html>
  );
};

const WallCreationDimensions = ({ startPoint, currentEndPoint }) => {
  if (!startPoint || !currentEndPoint) return null;
  
  const start = new THREE.Vector3(...startPoint);
  const end = new THREE.Vector3(...currentEndPoint);
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  const length = start.distanceTo(end);
  
  const direction = new THREE.Vector3().subVectors(end, start);
  const angleRad = Math.atan2(direction.z, direction.x);
  const angleDeg = (angleRad * 180 / Math.PI).toFixed(1);
  
  return (
    <Html position={[center.x, 0.5, center.z]}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        transform: 'translate3d(-50%, -50%, 0)',
        fontFamily: 'Arial'
      }}>
        <div style={{ marginBottom: '3px' }}>Length: {length.toFixed(2)}m</div>
        <div>Angle: {angleDeg}°</div>
      </div>
    </Html>
  );
};

export { WallDimensions, WallCreationDimensions };