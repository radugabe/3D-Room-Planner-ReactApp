import { useEffect, useState } from "react";

export function useSceneLoading(models) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!models || models.length === 0) {
      setIsLoading(false);
      return;
    }

    const allLoaded = models.every(model => model.__loaded === true);
    setIsLoading(!allLoaded);
  }, [models]);

  return isLoading;
}
