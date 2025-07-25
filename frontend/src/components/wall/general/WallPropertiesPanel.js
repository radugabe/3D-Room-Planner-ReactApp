import { useState, useEffect, useRef } from "react";

const WallPropertiesPanel = ({ selectedWall, wallProps, onWallUpdate }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const lastUpdateRef = useRef({ wall: null, time: 0 });
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (selectedWall && wallProps && wallProps[selectedWall]) {
      if (isInitialRender.current || selectedWall !== lastUpdateRef.current.wall) {
        const currentWall = wallProps[selectedWall];
        if (currentWall && currentWall.size) {
          setWidth(currentWall.size[0]);
          setHeight(currentWall.size[1]);
          lastUpdateRef.current.wall = selectedWall;
        }
      }
      isInitialRender.current = false;
    }
  }, [selectedWall, wallProps]);

  const handleWidthChange = (newWidth) => {
    const parsedWidth = parseFloat(newWidth);
    if (!isNaN(parsedWidth)) {
      setWidth(parsedWidth);
      updateWallSize(parsedWidth, height);
    }
  };

  const handleHeightChange = (newHeight) => {
    const parsedHeight = parseFloat(newHeight);
    if (!isNaN(parsedHeight)) {
      setHeight(parsedHeight);
      updateWallSize(width, parsedHeight);
    }
  };

  const updateWallSize = (newWidth, newHeight) => {
    if (!selectedWall || !wallProps || !wallProps[selectedWall]) return;
    const now = Date.now();
    if (now - lastUpdateRef.current.time < 16) return;
    lastUpdateRef.current.time = now;

    const updatedProps = {
      ...wallProps[selectedWall],
      size: [newWidth, newHeight],
    };

    onWallUpdate(selectedWall, updatedProps);
  };

  const getWidthLabel = () => {
    if (!selectedWall) return "Width";
    switch (selectedWall) {
      case "front":
      case "back":
        return "Width";
      case "left":
      case "right":
        return "Depth";
      case "ceiling":
        return "Width";
      default:
        return "Width";
    }
  };

  const getHeightLabel = () => {
    if (!selectedWall) return "Height";
    switch (selectedWall) {
      case "front":
      case "back":
      case "left":
      case "right":
        return "Height";
      case "ceiling":
        return "Depth";
      default:
        return "Height";
    }
  };

  if (!selectedWall || !wallProps || !wallProps[selectedWall]) {
    return (
      <div className="p-5 text-center text-gray-400 bg-white shadow rounded-xl">
        <p>No wall selected. Click on a wall to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="absolute top-[90px] right-5 z-[1000] max-w-[280px] xl:max-w-[300px] w-full bg-white rounded-xl shadow-xl p-4 xl:p-5 border border-[#c2ad97] opacity-100 translate-y-0 pointer-events-auto block">
      <h3 className="mb-4 text-base font-semibold xl:text-lg text-dark">
        Wall Properties: {selectedWall.charAt(0).toUpperCase() + selectedWall.slice(1)}
      </h3>

      <div className="mb-5">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {getWidthLabel()} (m):
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="flex-1 appearance-none h-1 rounded bg-[#d6c3ae] cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
          />
          <input
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {getHeightLabel()} (m):
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="flex-1 appearance-none h-1 rounded bg-[#d6c3ae] cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
          />
          <input
            type="number"
            min="1"
            max="20"
            step="0.1"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default WallPropertiesPanel;
