import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ modelPath, position, scale = { x: 1, y: 1, z: 1 } }) => {
  const gltf = useLoader(GLTFLoader, modelPath);

  return (
    <primitive
      object={gltf.scene}
      position={position}
      scale={[scale.x, scale.y, scale.z]}
    />
  );
};

export default Model;
