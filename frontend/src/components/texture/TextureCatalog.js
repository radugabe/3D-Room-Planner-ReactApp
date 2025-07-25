import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAllMaterials } from "../../services/MaterialService";
import { PERFORMANCE } from "../../utils/Constants";
import { throttle } from "../../utils/EventUtils";

const TextureCatalog = ({ onSelectTexture, selectedModelIndex }) => {
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchTextures = async () => {
      try {
        setLoading(true);
        const materialsData = await getAllMaterials();

        const formattedTextures = materialsData.map((material) => ({
          id: material.id,
          name: material.name,
          path: material.texture_path,
          colorCode: material.color_code,
          thumbnail: `${material.name}.png`,
        }));

        setTextures(formattedTextures);
        setError(null);
      } catch (err) {
        console.error("Eroare la încărcarea texturilor:", err);
        setError("Nu s-au putut încărca texturile. Vă rugăm încercați din nou.");
      } finally {
        setLoading(false);
      }
    };

    fetchTextures();
  }, []);

  useEffect(() => {
    setSelectedTexture(null);
  }, [selectedModelIndex]);

  const handleSelectTexture = (texturePath) => {
    setSelectedTexture(texturePath);
    onSelectTexture(texturePath);
  };

  const handleSelectTextureThrottled = throttle(handleSelectTexture, PERFORMANCE.THROTTLE_DELAY);

  if (selectedModelIndex === null) return null;

  return (
    <div className="w-full mb-3 bg-white border border-sand rounded-xl">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 text-left rounded-t-xl"
      >
        <h3 className="text-lg font-semibold text-dark">Model Textures</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 transition-transform duration-300 text-dark" />
        ) : (
          <ChevronDown className="w-5 h-5 transition-transform duration-300 text-dark" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 max-h-[380px] overflow-y-auto">
          {loading && <p className="text-sm italic text-gray-400">Se încarcă texturile...</p>}
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          {!loading && !error && textures.length === 0 && (
            <p className="text-sm italic text-gray-400">Nu există texturi disponibile.</p>
          )}

          {!loading && !error && textures.length > 0 && (
            <div className="grid grid-cols-2 gap-1 sm:gap-2 xl:gap-3 place-items-center">
              {textures.map((texture) => (
                <div
                  key={texture.id}
                  onClick={() => handleSelectTextureThrottled(texture.path)}
                  className={`w-[84px] h-[100px] cursor-pointer flex flex-col items-center justify-start rounded-xl shadow transition border ${
                    selectedTexture === texture.path
                      ? "border-accent bg-white"
                      : "border-transparent bg-sand hover:border-primary"
                  }`}
                >
                  <div className="w-[64px] h-[64px] mt-2">
                    <img
                      src={`${texture.path}/${texture.thumbnail}`}
                      alt={texture.name}
                      className="object-cover w-full h-full rounded"
                      onError={(e) => {
                        console.error(`Failed to load thumbnail: ${texture.path}/${texture.thumbnail}`);
                        e.target.src =
                          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIWSURBVHja7JnNaxNBFICfRkrhsJfGFHool0JbD3roXTyUBPTgRcGTF38ET0LxJIJnc/NP8CaIUKinUlCKhz3Zix68hWaXwm7yY6admUw2JttkN9nZJLPwEbLs7sx782bmzbydWBiGRrMYTaRJmgRpEqRJkJYF5MmTx5zgkSYnWGYOi+VTZnXxzCOFu7ztMCy2SfucIqI2LRe46Rr8tSCfPKa5ym9vcNXCL3/wRWzwDp+FPxJGzHCHx5QZ4xAP93mS90e4wyOO9H3+kFXu4bLAJm/FQFxOMMsVmqKNR5HvfGSX9wNJUZnXzLCgIFZEb9eV+GRlSUWsipWeFXP/FKRoLSMj4qQJnR2XQcQEUUCWQfYoBaTIHTFFExBRdxHYpM0o1SHCJwHyveDEE5qUiIBqASAVQQtkjUd8wzaEfK5xLnLSUFXW2mPPK461Wa2+I5XPbZwUPulkrZN6pEc2qXApcpfyKLepJoVP7iF/KKUQpJwMyMeUQWTxk7w5HmQXK8UgmXQ8yAEXUgxy2IuTZLIWx12j2f0Oaq+SbUHq+Mm2ILL9Yh5Aupj0ASH20EhbSKG7N6/WtYhX10pXCdIuXvJa1ioWO/5hG+eEe35VrNxVESZPudT5fKdxF+HymGMdOqf3O63oJetqxL9gxHBpOsRzw9iiJV7b8X8Kmv/sNUmTIE2CXGqQfwIMAIBUJMWOzW3UAAAAAElFTkSuQmCC";
                      }}
                    />
                  </div>
                  <span className="text-xs text-white mt-1 truncate w-[72px] text-center">{texture.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

};

export default TextureCatalog;