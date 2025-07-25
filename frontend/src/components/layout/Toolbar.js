import HelpTooltip from "../common/HelpTooltip";
import { exportProject } from "../../utils/ProjectExporter";
import { invalidate } from "@react-three/fiber";
import {
  Move, Rotate3D, Maximize2, Eye, Grid2X2,
  BrickWall, Layers, FileDown, LogOut, HelpCircle, RefreshCcw
} from "lucide-react";

function Toolbar({
  editMode,
  setEditMode,
  wireframeMode,
  toggleWireframeMode,
  showGrid,
  toggleGrid,
  openRoomDimensionsDialog,
  wallSelectionMode,
  toggleSelectionMode,
  onBackToMenu,
  wallsTransparent,
  toggleWallsTransparency,
  walls,
  models,
  roomSize,
  wallTexture,
  floorTexture,
  plannerType,
  customFloorTexture,
  setRefreshKey,
  onForceRefreshTextures 
}) {
  const handleExportProject = () => {
    exportProject({
      plannerType,
      roomSize: plannerType === "rectangular" ? roomSize : null,
      wallTexture: plannerType === "rectangular" ? wallTexture : null,
      floorTexture: plannerType === "custom" ? customFloorTexture : floorTexture,
      walls: plannerType === "custom" ? walls : [],
      models
    });
  };

  const ButtonWithTooltip = ({ onClick, children, label, active = false, className = "" }) => (
    <div className={`relative group w-fit ${className}`}>
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition hover:scale-110 ${
          active ? "bg-white text-primary font-bold" : "bg-transparent text-dark"
        }`}
      >
        {children}
      </button>
      <div className="absolute z-40 px-3 py-1 mt-2 text-sm text-white transition-opacity duration-300 -translate-x-1/2 shadow opacity-0 pointer-events-none left-1/2 top-full bg-dark rounded-xl group-hover:opacity-100 whitespace-nowrap">
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, #c2ad97, #e7dbc9, #d6c3ae, #e7dac9, #c2ad97, #e7dbc9)`
      }}
      className="flex items-center gap-3 px-8 py-2 text-sm shadow-md text-dark xl:px-12 xl:py-2 xl:gap-4 2xl:px-14 2xl:py-3 2xl:gap-5"
    >

      {!wallSelectionMode && (
        <>
          <ButtonWithTooltip
            onClick={() => setEditMode("move")}
            label="Move"
            active={editMode === "move"}
          >
            <Move className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
          </ButtonWithTooltip>

          <ButtonWithTooltip
            onClick={() => setEditMode("rotate")}
            label="Rotate"
            active={editMode === "rotate"}
          >
            <Rotate3D className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
          </ButtonWithTooltip>

          <ButtonWithTooltip
            onClick={() => setEditMode("scale")}
            label="Scale"
            active={editMode === "scale"}
          >
            <Maximize2 className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
          </ButtonWithTooltip>

          <div className="w-[1px] h-5 xl:h-6 2xl:h-8 bg-dark/30 mx-1 xl:mx-2" />
        </>
      )}

      <ButtonWithTooltip
        onClick={toggleWireframeMode}
        label={wireframeMode ? "Show Walls" : "Show Wireframe"}
        active={wireframeMode}
      >
        <Eye className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      </ButtonWithTooltip>

      <ButtonWithTooltip
        onClick={toggleGrid}
        label={showGrid ? "Hide Grid" : "Show Grid"}
        active={!showGrid}
      >
        <Grid2X2 className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      </ButtonWithTooltip>

      <div className="w-[1px] h-5 xl:h-6 2xl:h-8 bg-dark/30 mx-1 xl:mx-2" />

      <ButtonWithTooltip
        onClick={toggleSelectionMode}
        label={wallSelectionMode ? "Edit Model" : "Edit Walls"}
        active={wallSelectionMode}
      >
        <BrickWall className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      </ButtonWithTooltip>

      {typeof openRoomDimensionsDialog === "function" && (
        <ButtonWithTooltip
          onClick={openRoomDimensionsDialog}
          label="Resize Room"
        >
          <Maximize2 className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
        </ButtonWithTooltip>
      )}

      {typeof wallsTransparent === "boolean" && typeof toggleWallsTransparency === "function" && (
        <ButtonWithTooltip
          onClick={toggleWallsTransparency}
          label={wallsTransparent ? "Walls: Transparent" : "Walls: Solid"}
          active={wallsTransparent}
        >
          <Layers className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
        </ButtonWithTooltip>
      )}

      <ButtonWithTooltip
        onClick={onForceRefreshTextures}
        label="Refresh Models"
        className="ml-auto"
      >
        <RefreshCcw className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      </ButtonWithTooltip>

      <ButtonWithTooltip
        onClick={handleExportProject}
        label="Export Project"
        className=""
      >
        <FileDown className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      </ButtonWithTooltip>

      <div className="relative group w-fit">
        <HelpTooltip
          steps={wallSelectionMode ? [
            "• Left click to set the starting point of the wall.",
            "• Left click again to set the end point.",
            "• Repeat for other walls."
          ] : [
            "• Left click to select model.",
            "• Right click to rotate camera.",
            "• Scroll to zoom.",
            "• Key Q + Left click to pan.",
            "• Modes: Move, Rotate, Scale for the selected model."
          ]}
          icon={<HelpCircle className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />}
        />

        <div className="absolute z-40 px-3 py-1 mt-2 text-sm text-white transition-opacity duration-300 -translate-x-1/2 shadow opacity-0 pointer-events-none left-1/2 top-full bg-dark rounded-xl group-hover:opacity-100 whitespace-nowrap">
          Help
        </div>
      </div>


      <ButtonWithTooltip
        onClick={onBackToMenu}
        label="Back to Menu"
      >
        <LogOut className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
      </ButtonWithTooltip>
    </div>
  );
}

export default Toolbar;
