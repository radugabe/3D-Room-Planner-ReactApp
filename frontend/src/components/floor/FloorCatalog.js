import { useEffect, useState } from "react";
import { getAllFloors } from "../../services/FloorService";
import { PERFORMANCE } from "../../utils/Constants";
import { throttle } from "../../utils/EventUtils";
import resourceManager from "../../utils/ResourceManager";
import { ChevronDown, ChevronUp } from "lucide-react";

const FloorCatalog = ({ onSelectFloorTexture, selectedFloorTexture  }) => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedTexture = selectedFloorTexture;

  useEffect(() => {
    const fetchTextures = async () => {
      try {
        setLoading(true);
        const floorData = await getAllFloors();

        const formattedTextures = floorData.map(floor => {
          const pathParts = floor.texture_path.split('/');
          const materialName = pathParts[pathParts.length - 1];
          
          return {
            id: floor.id,
            name: floor.name,
            path: floor.texture_path,
            thumbnail: `${materialName}_Color.jpg`
          };
        });
        
        setFloors(formattedTextures);
        setError(null);
      } catch (err) {
        console.error("Eroare la încărcarea texturilor pentru podea:", err);
        setError("Nu s-au putut încărca texturile. Vă rugăm încercați din nou.");
      } finally {
        setLoading(false);
      }
    };

    fetchTextures();
  }, []);

  const handleSelectTexture = (texturePath) => {
    if (texturePath) {
      const baseName = texturePath.split('/').pop();
      const colorPath = `${texturePath}/${baseName}_Color.jpg`;

      resourceManager.loadTexture(colorPath, { repeat: { x: 2, y: 2 } })
          .catch(error => {
              console.error("Eroare la pre-încărcarea texturii podelei:", error);
          });
    }

    onSelectFloorTexture(texturePath);
  };

  const handleSelectTextureThrottled = throttle(handleSelectTexture, PERFORMANCE.THROTTLE_DELAY);

  const handleRemoveTexture = () => {
    onSelectFloorTexture(null);
  };

  return (
    <div className="w-full mb-3 bg-white border border-sand rounded-xl">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 text-left rounded-t-xl"
      >
        <h3 className="text-lg font-semibold text-dark">Floor Textures</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 transition-transform duration-300 text-dark" />
        ) : (
          <ChevronDown className="w-5 h-5 transition-transform duration-300 text-dark" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3">
          <div className="max-h-[300px] overflow-y-auto pr-1">
            {loading && <p className="text-sm italic text-gray-400">Se încarcă...</p>}
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            {!loading && !error && floors.length === 0 && (
              <p className="text-sm italic text-gray-400">Nu există texturi disponibile.</p>
            )}

            {!loading && !error && floors.length > 0 && (
              <div className="grid items-center justify-center grid-cols-1 gap-1 mx-auto xl:grid-cols-2 2xl:grid-cols-2 sm:gap-2 xl:gap-3">
                {floors.map((floor) => (
                  <div
                    key={floor.id}
                    onClick={() => handleSelectTextureThrottled(floor.path)}
                    className={`w-[64px] h-[80px] sm:w-[72px] sm:h-[88px] xl:w-[84px] xl:h-[100px] cursor-pointer flex flex-col 
                      items-center justify-start rounded-xl shadow transition border ${
                      selectedTexture === floor.path
                        ? "border-accent bg-white"
                        : "border-transparent bg-sand hover:border-primary"
                    }`}
                  >
                    <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] xl:w-[64px] xl:h-[64px] mt-1 sm:mt-2">
                      <img
                        src={`${floor.path}/${floor.thumbnail}`}
                        alt={floor.name}
                        className="object-cover w-full h-full rounded"
                        onError={(e) => {
                          console.error(`Fail: ${floor.path}/${floor.thumbnail}`);
                          e.target.style.backgroundColor = "#ccc";
                        }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs xl:text-sm text-white mt-1 w-[56px] sm:w-[64px] xl:w-[72px] text-center truncate">
                      {floor.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedTexture && (
            <button
              onClick={handleRemoveTexture}
              className="mt-3 px-3 py-1.5 text-sm text-brown bg-sand rounded-xl shadow hover:bg-primary transition"
            >
              Remove Floor Texture
            </button>
          )}
        </div>
      )}

    </div>
  );

};

export default FloorCatalog;