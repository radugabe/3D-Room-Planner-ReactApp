import { useState } from "react";
import ModelCatalog from "../model/ModelCatalog";
import TextureCatalog from "../texture/TextureCatalog";
import FloorCatalog from "../floor/FloorCatalog";
import WallCatalog from "../wall/WallCatalog";
import ViewControls from "./ViewControls";
import { Eye, Brush, Box, FolderOpen } from "lucide-react";

function Sidebar({
  wallSelectionMode,
  moveVertical,
  setMoveVertical,
  selectedModelIndex,
  selectedWall,
  deleteSelectedModel,
  handleSelectTexture,
  setSelectedFloorTexture,
  selectedFloorTexture,
  setSelectedWallTexture,
  selectedWallTexture,
  setIsLoading,
  setModels,
}) {
  const [activePanel, setActivePanel] = useState(null);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, #c2ad97, #e7dbc9, #d6c3ae, #e7dac9, #c2ad97, #e7dbc9)`,
        }}
        className="fixed z-30 flex flex-col items-center gap-4 px-2 py-3 -translate-y-1/2 shadow-lg top-1/2 left-3 xl:left-5 2xl:left-6 xl:gap-6 2xl:gap-10 xl:px-2 xl:py-6 2xl:px-4 2xl:py-8 rounded-xl xl:rounded-2xl"
      >
        {[
          { icon: Eye, panel: "controls", label: "View" },
          { icon: Brush, panel: "textures", label: "Textures" },
          { icon: Box, panel: "selected", label: "Selected" },
          { icon: FolderOpen, panel: "models", label: "Catalog" },
        ].map(({ icon: Icon, panel, label }) => (
          <div key={panel} className="relative group w-fit">
            <button
              onClick={() => togglePanel(panel)}
              className={`relative w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10
                flex items-center justify-center rounded-full text-dark hover:scale-110 transition 
                ${activePanel === panel ? "bg-white text-primary font-bold" : "bg-transparent"}`}
            >
              <Icon className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" />
            </button>

            <div
              className="absolute z-40 px-3 py-1 ml-3 text-sm text-white transition-opacity duration-300 -translate-y-1/2 shadow opacity-0 pointer-events-none left-full top-1/2 bg-dark rounded-xl group-hover:opacity-100 whitespace-nowrap"
            >
              {label}
            </div>
          </div>

        ))}
      </div>

      {activePanel && (
        <div className="
          fixed top-1/2 left-[90px] 2xl:left-[120px] -translate-y-1/2
          w-[260px] xl:w-[300px] 2xl:w-[320px]
          p-2 xl:p-3 2xl:p-4
          max-h-[70vh] overflow-y-auto
          bg-white text-dark text-base xl:text-lg
          rounded-lg xl:rounded-xl
          shadow-xl border border-[#c2ad97] z-20"
        >    
          {wallSelectionMode && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Edit Walls Mode</h3>
              <p className="text-sm">No tools available yet for this mode.</p>
            </div>
          )}

          {!wallSelectionMode && activePanel === "controls" && (
            <>
              <h3 className="mb-4 text-lg font-semibold">View Controls</h3>
              <ViewControls
                moveVertical={moveVertical}
                toggleMoveVertical={() => setMoveVertical((prev) => !prev)}
              />
            </>
          )}

          {!wallSelectionMode && activePanel === "textures" && (
            <>
              <h3 className="mb-2 text-lg font-semibold">Room Textures</h3>
              <FloorCatalog 
                onSelectFloorTexture={setSelectedFloorTexture} 
                selectedFloorTexture={selectedFloorTexture}
              />
              <WallCatalog
                onSelectWallTexture={setSelectedWallTexture}
                selectedWallTexture={selectedWallTexture}
              />
            </>
          )}

          {!wallSelectionMode && activePanel === "selected" && (
            <>
              <h3 className="mb-2 text-lg font-semibold">Selected Object</h3>

              {selectedModelIndex === null ? 
                <p className="mb-2 text-sm">No object selected.</p> :
                <TextureCatalog
                  selectedModelIndex={selectedModelIndex}
                  onSelectTexture={handleSelectTexture}
                />
              }


              {selectedModelIndex !== null && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="w-1/2 px-2 py-1.5 text-xs xl:px-3 xl:py-2 xl:text-sm text-white bg-sand rounded-xl shadow hover:bg-primary transition"
                    onClick={() => deleteSelectedModel(selectedModelIndex)}
                  >
                    Delete Model
                  </button>
                  <button
                    className="w-1/2 px-2 py-1.5 text-xs xl:px-3 xl:py-2 xl:text-sm text-white bg-sand rounded-xl shadow hover:bg-primary transition"
                    onClick={() => handleSelectTexture(null)}
                  >
                    Remove Texture
                  </button>
                </div>
              )}
            </>
          )}

          {!wallSelectionMode && activePanel === "models" && (
            <>
              <h3 className="mb-2 text-lg font-semibold">Model Catalog</h3>
              <ModelCatalog
                onAddModel={(item) => {
                  if (!item?.modelPath) return;
                  setIsLoading(true);
                  setModels((prev) => [
                    ...prev,
                    {
                      id: `model-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                      name: item.name || "Unnamed",
                      modelPath: item.modelPath,
                      position: [0, 0, 0],
                      rotation: [0, 0, 0],
                      scale: item.scale || item.defaultScale || { x: 1, y: 1, z: 1 },
                      texturePath: null,
                    },
                  ]);
                  setTimeout(() => setIsLoading(false), 300);
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
