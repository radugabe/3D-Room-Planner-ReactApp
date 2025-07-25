import { useState } from "react";

export function useTextureRefresh(models, setSelectedModelIndex) {
  const [refreshing, setRefreshing] = useState(false);

  const forceRefreshTextures = () => {
    if (!models || models.length === 0) return;

    setRefreshing(true);
    let index = 0;

    const selectNextModel = () => {
      if (index < models.length) {
        setSelectedModelIndex(index);
        index++;
        setTimeout(selectNextModel, 100);
      } else {
        setTimeout(() => {
          setSelectedModelIndex(null);
          setRefreshing(false);
        }, 150);
      }
    };

    selectNextModel();
  };

  return { forceRefreshTextures, refreshing };
}
