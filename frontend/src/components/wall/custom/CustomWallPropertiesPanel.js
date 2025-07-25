import { useState, useEffect, useRef } from "react";

const CustomWallPropertiesPanel = ({ selectedWall, wallProps, onWallUpdate, customWalls, selectedWallIndex, onDeselectWall }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [angle, setAngle] = useState(0);
  const lastUpdateRef = useRef({ wall: null, time: 0 });
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (selectedWallIndex !== null && customWalls && customWalls[selectedWallIndex]) {
      const wall = customWalls[selectedWallIndex];
      if (wall.startPoint && wall.endPoint) {
        const startPoint = wall.startPoint;
        const endPoint = wall.endPoint;
        const dx = endPoint[0] - startPoint[0];
        const dz = endPoint[2] - startPoint[2];
        const length = Math.sqrt(dx * dx + dz * dz);
        setWidth(length);
      }
      setHeight(wall.height || 3);
      setAngle(wall.angle !== undefined ? wall.angle : 0);
      lastUpdateRef.current.wall = selectedWallIndex;
      isInitialRender.current = false;
    }
  }, [selectedWallIndex, customWalls]);

  const handleWidthChange = (newWidth) => {
    const parsedWidth = parseFloat(newWidth);
    if (!isNaN(parsedWidth)) {
      setWidth(parsedWidth);
      updateWallProperties(parsedWidth, height, angle);
    }
  };

  const handleHeightChange = (newHeight) => {
    const parsedHeight = parseFloat(newHeight);
    if (!isNaN(parsedHeight)) {
      setHeight(parsedHeight);
      updateWallProperties(width, parsedHeight, angle);
    }
  };

  const handleAngleChange = (newAngle) => {
    const parsedAngle = parseFloat(newAngle);
    if (!isNaN(parsedAngle)) {
      setAngle(parsedAngle);
      updateWallProperties(width, height, parsedAngle);
    }
  };

  const handleDelete = () => {
    if (selectedWallIndex !== null) {
      const updated = [...customWalls];
      updated.splice(selectedWallIndex, 1);
      onWallUpdate(updated);
      if (typeof onDeselectWall === "function") {
        onDeselectWall();
      }
    }
  };

  const updateWallProperties = (newWidth, newHeight, newAngle) => {
    if (selectedWallIndex === null || !customWalls || !customWalls[selectedWallIndex]) return;
    const now = Date.now();
    if (now - lastUpdateRef.current.time < 16) return;
    lastUpdateRef.current.time = now;

    const wall = customWalls[selectedWallIndex];
    const startPoint = [...wall.startPoint];
    const endPoint = [...wall.endPoint];
    const centerX = (startPoint[0] + endPoint[0]) / 2;
    const centerZ = (startPoint[2] + endPoint[2]) / 2;
    const angleRad = (newAngle * Math.PI) / 180;
    const halfLength = newWidth / 2;
    const newStartX = centerX - halfLength * Math.cos(angleRad);
    const newStartZ = centerZ - halfLength * Math.sin(angleRad);
    const newEndX = centerX + halfLength * Math.cos(angleRad);
    const newEndZ = centerZ + halfLength * Math.sin(angleRad);

    const updatedWall = {
      ...wall,
      startPoint: [newStartX, 0, newStartZ],
      endPoint: [newEndX, 0, newEndZ],
      height: newHeight,
      angle: newAngle
    };

    const updatedWalls = [...customWalls];
    updatedWalls[selectedWallIndex] = updatedWall;
    if (onWallUpdate) {
      onWallUpdate(updatedWalls);
    }
  };

  if (selectedWallIndex === null || !customWalls || !customWalls[selectedWallIndex]) {
    return (
      <div className="p-5 text-center text-gray-400 bg-white shadow rounded-xl">
        <p>No wall selected. Click on a wall to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="absolute top-[40px] right-5 z-[1000] w-full max-w-[300px] xl:max-w-[260px] 2xl:max-w-[320px] bg-white rounded-xl shadow-xl p-4 xl:p-3 2xl:p-5 border border-[#c2ad97]">
      <h3 className="mb-4 text-base font-semibold xl:text-sm 2xl:text-lg text-dark">Wall Properties</h3>

      {[{
        label: "Length (m):",
        value: width,
        onChange: handleWidthChange,
        min: 0.1,
        max: 20,
        step: 0.1
      }, {
        label: "Height (m):",
        value: height,
        onChange: handleHeightChange,
        min: 0.1,
        max: 5,
        step: 0.1
      }, {
        label: "Angle (°):",
        value: angle,
        onChange: handleAngleChange,
        min: 0,
        max: 359,
        step: 1
      }].map(({ label, value, onChange, min, max, step }, index) => (
        <div className="mb-5" key={index}>
          <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 appearance-none h-1 rounded bg-[#d6c3ae] cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
            />
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={index === 2 ? Math.round(value) : value.toFixed(1)}
              onChange={(e) => onChange(e.target.value)}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md xl:w-14"
            />
          </div>
        </div>
      ))}

      <div className="mt-2">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 mt-2 text-sm text-white transition shadow bg-sand rounded-xl hover:bg-primary"
        >
          Delete Wall
        </button>
      </div>
    </div>
  );
};

export default CustomWallPropertiesPanel;