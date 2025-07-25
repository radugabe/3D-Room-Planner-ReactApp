import { useState, useCallback, useEffect } from "react";

export function useWallUpdate(wallProps, roomSize, onRoomSizeChange, setWallUpdateFunction) {
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleWallUpdate = useCallback((wallName, newProps) => {
    if (!wallProps) return;

    const updatedWallProps = JSON.parse(JSON.stringify(wallProps));
    updatedWallProps[wallName] = {
      ...updatedWallProps[wallName],
      ...newProps
    };

    let newRoomSize = { ...roomSize };

    if (wallName === "front" || wallName === "back") {
      const newWidth = newProps.size[0];

      updatedWallProps.left.position[0] = -newWidth / 2;
      updatedWallProps.right.position[0] = newWidth / 2;
      updatedWallProps.ceiling.size[0] = newWidth;

      updatedWallProps.front.size[0] = newWidth;
      updatedWallProps.back.size[0] = newWidth;

      const newHeight = newProps.size[1];

      updatedWallProps.front.size[1] = newHeight;
      updatedWallProps.back.size[1] = newHeight;
      updatedWallProps.left.size[1] = newHeight;
      updatedWallProps.right.size[1] = newHeight;

      updatedWallProps.front.position[1] = newHeight / 2;
      updatedWallProps.back.position[1] = newHeight / 2;
      updatedWallProps.left.position[1] = newHeight / 2;
      updatedWallProps.right.position[1] = newHeight / 2;
      updatedWallProps.ceiling.position[1] = newHeight;

      newRoomSize.width = newWidth;
      newRoomSize.height = newHeight;
    } else if (wallName === "left" || wallName === "right") {
      const newDepth = newProps.size[0];

      updatedWallProps.front.position[2] = -newDepth / 2;
      updatedWallProps.back.position[2] = newDepth / 2;
      updatedWallProps.ceiling.size[1] = newDepth;

      updatedWallProps.left.size[0] = newDepth;
      updatedWallProps.right.size[0] = newDepth;

      const newHeight = newProps.size[1];

      updatedWallProps.front.size[1] = newHeight;
      updatedWallProps.back.size[1] = newHeight;
      updatedWallProps.left.size[1] = newHeight;
      updatedWallProps.right.size[1] = newHeight;

      updatedWallProps.front.position[1] = newHeight / 2;
      updatedWallProps.back.position[1] = newHeight / 2;
      updatedWallProps.left.position[1] = newHeight / 2;
      updatedWallProps.right.position[1] = newHeight / 2;
      updatedWallProps.ceiling.position[1] = newHeight;

      newRoomSize.depth = newDepth;
      newRoomSize.height = newHeight;
    } else if (wallName === "ceiling") {
      const newWidth = newProps.size[0];
      const newDepth = newProps.size[1];

      updatedWallProps.front.size[0] = newWidth;
      updatedWallProps.back.size[0] = newWidth;
      updatedWallProps.left.position[0] = -newWidth / 2;
      updatedWallProps.right.position[0] = newWidth / 2;

      updatedWallProps.left.size[0] = newDepth;
      updatedWallProps.right.size[0] = newDepth;
      updatedWallProps.front.position[2] = -newDepth / 2;
      updatedWallProps.back.position[2] = newDepth / 2;

      newRoomSize.width = newWidth;
      newRoomSize.depth = newDepth;
    }

    setForceUpdate(prev => prev + 1);

    if (onRoomSizeChange) {
      onRoomSizeChange(newRoomSize);
    }
  }, [wallProps, roomSize, onRoomSizeChange]);

  useEffect(() => {
    if (setWallUpdateFunction && typeof setWallUpdateFunction === 'function') {
      setWallUpdateFunction(handleWallUpdate);
    }
  }, [handleWallUpdate, setWallUpdateFunction]);

  return { handleWallUpdate, forceUpdate };
}
