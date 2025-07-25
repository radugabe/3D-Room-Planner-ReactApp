import { useState } from "react";

function useObjectControlsManager(getSelectedModelRotation, handleRotation) {
  const [uniformScale, setUniformScale] = useState(true);

  const handleRotationChange = (axis, value) => {
    handleRotation(axis, value);
  };

  const getRotationDegrees = (axisIndex) => {
    const rotation = getSelectedModelRotation();
    return (rotation[axisIndex] * (180 / Math.PI)).toFixed(0);
  };

  const getRotationRadians = (axisIndex) => {
    const rotation = getSelectedModelRotation();
    return rotation[axisIndex];
  };

  return {
    uniformScale,
    setUniformScale,
    handleRotationChange,
    getRotationDegrees,
    getRotationRadians,
  };
}

export default useObjectControlsManager;
