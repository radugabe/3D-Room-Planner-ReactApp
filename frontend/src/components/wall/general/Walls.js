import SelectableWall from "./SelectableWall";

const Walls = ({ 
  wallProps, 
  selectedWall, 
  wallSelectionMode, 
  onWallSelect, 
  handleWallUpdate, 
  roomSize, 
  wallTexture, 
  wireframeMode,
  forceUpdate
}) => {
  if (!wallProps) return null;

  return (
    <>
      {Object.keys(wallProps).map((wallKey) => (
        wallKey !== "floor" && (
          <SelectableWall 
            key={`${wallKey}-${forceUpdate}`}
            wallProps={wallProps[wallKey]} 
            isSelected={wallSelectionMode && selectedWall === wallKey}
            onSelect={wallSelectionMode ? onWallSelect : () => {}}
            onResize={wallSelectionMode ? handleWallUpdate : () => {}}
            roomSize={roomSize}
            wallTexture={wallTexture}
            wireframeMode={wireframeMode}
          />
        )
      ))}
    </>
  );
};

export default Walls;
