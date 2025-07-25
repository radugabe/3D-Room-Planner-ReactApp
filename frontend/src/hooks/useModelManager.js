import { useState, useEffect } from "react";

function useModelManager() {
  const [models, setModels] = useState([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState(null);
  const [previousSelectedIndex, setPreviousSelectedIndex] = useState(null);

  useEffect(() => {
    if (previousSelectedIndex !== selectedModelIndex) {
      setPreviousSelectedIndex(selectedModelIndex);
    }
  }, [selectedModelIndex, previousSelectedIndex]);

  const handleScaleChange = (newScale) => {
    if (selectedModelIndex === null) return;

    setModels(prevModels => {
      const updatedModels = [...prevModels];
      updatedModels[selectedModelIndex] = {
        ...updatedModels[selectedModelIndex],
        scale: newScale
      };
      return updatedModels;
    });
  };

  const handleRotation = (axis, value) => {
    if (selectedModelIndex === null) return;

    setModels(prevModels => {
      const updatedModels = [...prevModels];
      const currentRotation = [...(updatedModels[selectedModelIndex].rotation || [0, 0, 0])];

      if (axis === 'x') currentRotation[0] = value;
      if (axis === 'y') currentRotation[1] = value;
      if (axis === 'z') currentRotation[2] = value;
      if (axis === 'reset') {
        updatedModels[selectedModelIndex] = {
          ...updatedModels[selectedModelIndex],
          rotation: [0, 0, 0]
        };
        return updatedModels;
      }

      updatedModels[selectedModelIndex] = {
        ...updatedModels[selectedModelIndex],
        rotation: currentRotation
      };

      return updatedModels;
    });
  };

  const deleteSelectedModel = () => {
    if (selectedModelIndex === null) return;

    setModels(prevModels => {
      const updatedModels = [...prevModels];
      updatedModels.splice(selectedModelIndex, 1);
      return updatedModels;
    });

    setSelectedModelIndex(null);
  };

  const getSelectedModelScale = () => {
    if (selectedModelIndex === null || !models[selectedModelIndex]) {
      return { x: 1, y: 1, z: 1 };
    }
    return models[selectedModelIndex].scale || { x: 1, y: 1, z: 1 };
  };

  const getSelectedModelRotation = () => {
    if (selectedModelIndex === null || !models[selectedModelIndex]) {
      return [0, 0, 0];
    }
    return models[selectedModelIndex].rotation || [0, 0, 0];
  };

  return {
    models,
    setModels,
    selectedModelIndex,
    setSelectedModelIndex,
    previousSelectedIndex,
    handleScaleChange,
    handleRotation,
    deleteSelectedModel,
    getSelectedModelScale,
    getSelectedModelRotation
  };
  
}

export default useModelManager;
