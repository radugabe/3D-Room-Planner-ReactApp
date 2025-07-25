import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { PERFORMANCE } from "../../utils/Constants";
import { throttle } from "../../utils/EventUtils";
import resourceManager from "../../utils/ResourceManager";

import { useFetchModels } from "./hooks/useFetchModels";
import { usePreloadModels } from "./hooks/usePreloadModels";

const ModelCatalog = ({ onAddModel }) => {
    const { modelItems, loading, error } = useFetchModels();
    const modelStatus = usePreloadModels(modelItems);
    const [openCategory, setOpenCategory] = useState(null);

    const groupedModels = useMemo(() => {
        return modelItems.reduce((groups, item) => {
            const category = item.category || "Uncategorized";
            if (!groups[category]) groups[category] = [];
            groups[category].push(item);
            return groups;
        }, {});
    }, [modelItems]);

    const handleAddModel = async (item) => {
        if (!item?.modelPath) {
            console.error("Missing modelPath for item:", item);
            return;
        }
        try {
            await resourceManager.loadModel(item.modelPath);
            console.log("Adăugare mobilier:", item);

            onAddModel({
                ...item,
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: item.defaultScale || { x: 1, y: 1, z: 1 }
            });
        } catch (error) {
            console.error("Eroare la adăugarea mobilierului:", error);
        }
    };

    const handleAddModelThrottled = throttle(handleAddModel, PERFORMANCE.THROTTLE_DELAY);

    return (
    <div className="mb-4 text-dark">
        <div className="flex flex-col w-full gap-4">
        {loading && (
            <p className="text-sm text-gray-600">Se încarcă mobilierul...</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && modelItems.length === 0 && (
            <p className="text-sm text-gray-600">
            Nu există piese de mobilier disponibile.
            </p>
        )}

        {!loading &&
            !error &&
            Object.keys(groupedModels).map((category) => (
            <div
                key={category}
                className="w-full bg-white border border-sand rounded-xl"
            >
                <button
                onClick={() =>
                    setOpenCategory((prev) => (prev === category ? null : category))
                }
                className="flex items-center justify-between w-full px-4 py-2 text-left rounded-t-xl"
                >
                <h3 className="text-lg font-semibold text-dark">{category}</h3>
                {openCategory === category ? (
                    <ChevronUp className="w-5 h-5 transition-transform duration-300 text-dark" />
                ) : (
                    <ChevronDown className="w-5 h-5 transition-transform duration-300 text-dark" />
                )}
                </button>

                {openCategory === category && (
                <div className="grid grid-cols-1 gap-2 px-4 pb-4 xl:grid-cols-2 2xl:grid-cols-2 sm:gap-3 xl:gap-4 justify-items-center">
                    {groupedModels[category].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleAddModelThrottled(item)}
                        className="w-[80px] h-[96px] sm:w-[84px] sm:h-[100px] xl:w-[90px] xl:h-[104px] p-[4px] bg-sand rounded-xl shadow cursor-pointer hover:scale-105 transition flex flex-col items-center justify-start"
                    >
                        <img
                        src={`${item.path}/${item.thumbnail}`}
                        alt={item.name}
                        className="object-cover w-full h-full rounded-xl"
                        onError={(e) => {
                            console.error(
                            `Failed to load thumbnail: ${item.path}/${item.thumbnail}`
                            );
                        }}
                        />
                        {modelStatus[item.modelPath] === "loaded" && (
                        <span className="absolute text-sm font-bold text-white top-1 right-1">
                            ✓
                        </span>
                        )}
                        {modelStatus[item.modelPath] === "error" && (
                        <span className="absolute text-sm font-bold text-red-400 top-1 right-1">
                            !
                        </span>
                        )}
                    </button>
                    ))}
                </div>
                )}
            </div>
            ))}
        </div>
    </div>
    );
};

export default ModelCatalog;