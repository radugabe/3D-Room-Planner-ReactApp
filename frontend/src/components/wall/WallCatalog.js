import { useEffect, useState } from "react";
import { getAllWalls } from "../../services/WallService";
import resourceManager from "../../utils/ResourceManager";
import { ChevronDown, ChevronUp } from "lucide-react";

const WallCatalog = ({ onSelectWallTexture, selectedWallTexture }) => {
    const [walls, setWalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchTextures = async () => {
            try {
                setLoading(true);
                const wallData = await getAllWalls();
                const formattedTextures = wallData.map(wall => ({
                    id: wall.id,
                    name: wall.name,
                    path: wall.texture_path,
                    thumbnail: `${wall.texture_path}/${wall.texture_path.split('/').pop()}_Color.jpg`
                }));

                setWalls(formattedTextures);
                setError(null);
            } catch (err) {
                console.error("Eroare la încărcarea texturilor pentru pereți:", err);
                setError("Nu s-au putut încărca texturile pentru pereți.");
            } finally {
                setLoading(false);
            }
        };

        fetchTextures();
    }, []);

    const handleSelectTexture = (texturePath) => {
      if (selectedWallTexture === texturePath) return;

      const baseName = texturePath.split('/').pop();
      const colorPath = `${texturePath}/${baseName}_Color.jpg`;

      resourceManager.loadTexture(colorPath, { repeat: { x: 2, y: 2 } }).catch(() => {});
      onSelectWallTexture(texturePath);
    };

  return (
    <div className="w-full mb-3 bg-white border border-sand rounded-xl">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 text-left rounded-t-xl"
      >
        <h3 className="text-lg font-semibold text-dark">Wall Textures</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 transition-transform duration-300 text-dark" />
        ) : (
          <ChevronDown className="w-5 h-5 transition-transform duration-300 text-dark" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3">
          {loading && <p className="text-sm italic text-gray-400">Se încarcă texturile...</p>}
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          {!error && walls.length === 0 && (
            <p className="text-sm italic text-gray-400">Nu există texturi disponibile.</p>
          )}

          {!error && walls.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto pr-1 mb-3">
              <div className="grid items-center justify-center grid-cols-1 gap-1 xl:grid-cols-2 2xl:grid-cols-2 sm:gap-2 xl:gap-3">
                {walls.map((wall) => (
                  <div
                    key={wall.id}
                    onClick={() => handleSelectTexture(wall.path)}
                    className={`w-[64px] h-[80px] sm:w-[72px] sm:h-[88px] xl:w-[84px] xl:h-[100px]
                      cursor-pointer flex flex-col items-center justify-start rounded-xl shadow transition border ${
                        selectedWallTexture === wall.path
                          ? "border-accent bg-white"
                          : "border-transparent bg-sand hover:border-primary"
                      }`}
                  >
                    <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] xl:w-[64px] xl:h-[64px] mt-1 sm:mt-2">
                      <img
                        src={wall.thumbnail}
                        alt={wall.name}
                        className="object-cover w-full h-full rounded"
                        onError={(e) => {
                          console.warn(`Nu s-a putut încărca thumbnail-ul pentru ${wall.name}`);
                          e.target.style.backgroundColor = "#ccc";
                        }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs xl:text-sm text-white mt-1 w-[56px] sm:w-[64px] xl:w-[72px] text-center truncate">
                      {wall.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedWallTexture && (
            <button
              className="px-3 py-1.5 text-sm text-brown bg-sand rounded-xl shadow hover:bg-primary transition"
              onClick={() => onSelectWallTexture(null)}
            >
              Remove Wall Texture
            </button>
          )}
        </div>
      )}
    </div>
  );


};

export default WallCatalog;