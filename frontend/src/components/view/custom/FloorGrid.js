import React from "react";
import { Grid } from "@react-three/drei";

const FloorGrid = React.memo(({ roomSize, visible }) => {
  if (!visible) return null;

  return (
    <Grid 
      position={[0, 0.01, 0]}
      args={[roomSize.width * 2, roomSize.depth * 2, roomSize.width * 2, roomSize.depth * 2]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#6f8a91"
      sectionSize={2}
      sectionThickness={1}
      sectionColor="#2c3e50"
      fadeDistance={40}
      fadeStrength={1}
    />
  );
});

export default FloorGrid;
