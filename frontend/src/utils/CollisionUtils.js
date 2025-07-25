import * as THREE from "three";
import { OBB } from "three-stdlib";

export function createWallOBB(startPoint, endPoint, height, thickness, angleDeg) {
  const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
  const length = direction.length();
  const center = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
  center.y = height / 2;

  const obb = new OBB();
  obb.center.copy(center);
  obb.halfSize.set(length / 2, height / 2, thickness / 2);

  const rotationMatrix = new THREE.Matrix3();
  const euler = new THREE.Euler(0, -angleDeg * Math.PI / 180, 0);
  rotationMatrix.setFromMatrix4(new THREE.Matrix4().makeRotationFromEuler(euler));
  obb.rotation = rotationMatrix;

  return obb;
}

export function createModelOBB(position, rotation, scale, scaledSize) {
  const obb = new OBB();

  const halfSize = new THREE.Vector3(
    scaledSize.x / 2,
    scaledSize.y / 2,
    scaledSize.z / 2
  );

  obb.center.copy(new THREE.Vector3(...position));
  obb.halfSize.copy(halfSize);

  const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2], 'XYZ');
  const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
  const rotationMatrix = new THREE.Matrix3().setFromMatrix4(matrix);
  obb.rotation = rotationMatrix;

  return obb;
}


