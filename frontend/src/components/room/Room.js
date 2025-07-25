import Floor from "../floor/Floor";
import Walls from "../wall/general/Walls";

import { useFloorTexture } from "../floor/hooks/useFloorTexture";
import { useWallTexture } from "../wall/hooks/useWallTexture";
import { useWallProps } from "../wall/hooks/useWallProps";
import { useWallUpdate } from "../wall/hooks/useWallUpdate";

const Room = ({ 
  width = 5, 
  height = 3, 
  depth = 5, 
  wireframeMode, 
  selectedFloorTexture, 
  selectedWallTexture,
  wallSelectionMode = false,
  onWallSelect,
  selectedWall,
  onRoomSizeChange,
  onWallPropsUpdate,
  setWallUpdateFunction
}) => {

  const roomSize = { width, height, depth };
  const floorTexture = useFloorTexture(selectedFloorTexture);
  const wallTexture = useWallTexture(selectedWallTexture);
  const { wallProps, setWallProps } = useWallProps(width, height, depth, onWallPropsUpdate);
  const { handleWallUpdate, forceUpdate } = useWallUpdate(wallProps, roomSize, onRoomSizeChange, setWallUpdateFunction);

  if (!wallProps) return null;
  
  return (
    <>
      <Floor 
        width={width} 
        depth={depth} 
        position={[0, 0, 0]}
        floorTexture={floorTexture}
        wireframeMode={wireframeMode}
      />

      <Walls 
        wallProps={wallProps}
        selectedWall={selectedWall}
        wallSelectionMode={wallSelectionMode}
        onWallSelect={onWallSelect}
        handleWallUpdate={handleWallUpdate}
        roomSize={roomSize}
        wallTexture={wallTexture}
        wireframeMode={wireframeMode}
        forceUpdate={forceUpdate}
      />
    </>
  );
};

export default Room;