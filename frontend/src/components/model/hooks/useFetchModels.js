import { useState, useEffect, useRef } from "react";
import { getAllModels } from "../../../services/ModelService";

export function useFetchModels() {
  const [modelItems, setModelItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const models = await getAllModels();
        console.log("Modele primite:", models);

        const formattedModels = models.map(model => {
          const pathParts = model.modelPath.split('/');
          const modelName = pathParts[pathParts.length - 1].replace(".glb", "");

          return {
            id: model.id,
            name: model.name,
            modelPath: model.modelPath,
            path: model.path,
            thumbnail: `${modelName}.png`,
            category: model.category || 'Uncategorized',
            defaultScale: {
              x: model.defaultScale.x || 1,
              y: model.defaultScale.y || 1,
              z: model.defaultScale.z || 1
            }
          };
        });
        console.log("Formatare modele cu defaultScale:", formattedModels);


        setModelItems(formattedModels);
        setError(null);
      } catch (err) {
        console.error("Eroare la încărcarea mobilierului:", err);
        setError("Nu s-au putut încărca modelele. Vă rugăm încercați din nou.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return { modelItems, loading, error };
}
