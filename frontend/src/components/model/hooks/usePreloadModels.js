import { useEffect, useState, useRef } from "react";
import { CACHE } from "../../../utils/Constants";
import resourceManager from "../../../utils/ResourceManager";

export function usePreloadModels(modelItems) {
  const [modelStatus, setModelStatus] = useState({});
  const isMounted = useRef(true);

  useEffect(() => {
    const preloadModel = async (modelPath) => {
      try {
        await resourceManager.loadModel(modelPath);
        if (isMounted.current) {
          setModelStatus(prev => ({
            ...prev,
            [modelPath]: "loaded"
          }));
        }
      } catch (error) {
        console.error(`Error at model preload: ${modelPath}`, error);
        if (isMounted.current) {
          setModelStatus(prev => ({
            ...prev,
            [modelPath]: "error"
          }));
        }
      }
    };

    const preloadAllModels = async () => {
      for (const item of modelItems) {
        if (item?.modelPath) {
          preloadModel(item.modelPath);
        }
      }
    };

    if (modelItems.length > 0) {
      preloadAllModels();
    }

    return () => {
      isMounted.current = false;
    };
  }, [modelItems]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      resourceManager.clearUnused();
    }, CACHE.CLEANUP_INTERVAL);

    return () => clearInterval(cleanupInterval);
  }, []);

  return modelStatus;
}
