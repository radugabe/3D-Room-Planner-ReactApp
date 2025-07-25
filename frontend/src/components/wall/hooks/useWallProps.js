import { useState, useEffect, useMemo } from "react";

export function useWallProps(width, height, depth, onWallPropsUpdate) {
  const [wallProps, setWallProps] = useState(null);

  const defaultWallProps = useMemo(() => ({
    front: {
      name: "front",
      position: [0, height/2, -depth / 2],
      rotation: [0, 0, 0],
      size: [width, height],
      color: "#ffffff"
    },
    back: {
      name: "back",
      position: [0, height/2, depth / 2],
      rotation: [0, Math.PI, 0],
      size: [width, height],
      color: "#ffffff"
    },
    left: {
      name: "left",
      position: [-width / 2, height/2, 0],
      rotation: [0, Math.PI / 2, 0],
      size: [depth, height],
      color: "#ffffff"
    },
    right: {
      name: "right",
      position: [width / 2, height/2, 0],
      rotation: [0, -Math.PI / 2, 0],
      size: [depth, height],
      color: "#ffffff"
    },
    ceiling: {
      name: "ceiling",
      position: [0, height, 0],
      rotation: [Math.PI / 2, 0, 0],
      size: [width, depth],
      color: "#f5f5f5"
    },
    floor: {
      name: "floor",
      position: [0, 0, 0]
    }
  }), [width, height, depth]);

  useEffect(() => {
    setWallProps(defaultWallProps);
  }, [defaultWallProps]);

  useEffect(() => {
    if (onWallPropsUpdate && wallProps) {
      onWallPropsUpdate(wallProps);
    }
  }, [wallProps, onWallPropsUpdate]);

  return {
    wallProps,
    setWallProps
  };
}
