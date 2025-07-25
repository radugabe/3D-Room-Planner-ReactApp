import React, { useState, useEffect, useRef } from "react";
import { SCENE } from "../../utils/Constants";

const RoomDimensionsDialog = ({ initialDimensions, onSave, onCancel }) => {
  const [dimensions, setDimensions] = useState(
    initialDimensions || SCENE.DEFAULT_ROOM_SIZE
  );
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const roomWidth = dimensions.width;
    const roomDepth = dimensions.depth;
    const maxDim = Math.max(roomWidth, roomDepth);
    const scale = (Math.min(width, height) * 0.8) / maxDim;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaledWidth = roomWidth * scale;
    const scaledDepth = roomDepth * scale;

    ctx.beginPath();
    ctx.rect(
      centerX - scaledWidth / 2,
      centerY - scaledDepth / 2,
      scaledWidth,
      scaledDepth
    );
    ctx.strokeStyle = "#d6c3ae";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(214, 195, 174, 0.1)";
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= roomWidth; x++) {
      const scaledX = centerX - scaledWidth / 2 + x * scale;
      ctx.moveTo(scaledX, centerY - scaledDepth / 2);
      ctx.lineTo(scaledX, centerY + scaledDepth / 2);
    }

    for (let z = 0; z <= roomDepth; z++) {
      const scaledZ = centerY - scaledDepth / 2 + z * scale;
      ctx.moveTo(centerX - scaledWidth / 2, scaledZ);
      ctx.lineTo(centerX + scaledWidth / 2, scaledZ);
    }

    ctx.stroke();

    ctx.fillStyle = "#333333";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${roomWidth}m`, centerX, centerY + scaledDepth / 2 + 20);

    ctx.save();
    ctx.translate(centerX - scaledWidth / 2 - 20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${roomDepth}m`, 0, 0);
    ctx.restore();
  }, [dimensions]);

  const handleDimensionChange = (dimension, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setDimensions((prev) => ({ ...prev, [dimension]: numValue }));
    }
  };

  const handleSave = () => {
    onSave(dimensions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="w-[540px] max-w-[90vw] bg-white rounded-xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-center text-dark">Room Dimensions</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="flex-[1.3] flex items-center justify-center">
            <div className="flex flex-col gap-6 text-base">
              {[
                { label: "Width", id: "width", min: 1, max: 20, step: 0.1 },
                { label: "Depth", id: "depth", min: 1, max: 20, step: 0.1 },
                { label: "Height", id: "height", min: 1, max: 5, step: 0.1 },
              ].map(({ label, id, min, max, step }) => (
                <div key={id} className="flex items-center gap-2">
                  <label htmlFor={`room-${id}`} className="w-24 text-base font-medium text-gray-700">
                    {label}:
                  </label>
                  <input
                    type="number"
                    id={`room-${id}`}
                    min={min}
                    max={max}
                    step={step}
                    value={dimensions[id]}
                    onChange={(e) => handleDimensionChange(id, e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md text-center text-base"
                  />
                  <span className="text-sm text-gray-500">m</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <h3 className="text-center text-sm font-medium text-gray-700 mb-2">Room Preview</h3>
            <div className="border border-dashed border-gray-300 bg-gray-50 rounded-xl p-2">
              <canvas
                ref={canvasRef}
                width={180}
                height={180}
                className="bg-white rounded"
              ></canvas>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 border-t border-gray-200 p-4">
          <button
            className="w-40 px-4 py-2 text-[16px] text-white bg-gray-500 rounded-xl shadow hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="w-40 px-4 py-2 text-[16px] text-white bg-primary rounded-xl shadow hover:bg-sand transition"
            onClick={handleSave}
          >
            Apply Dimensions
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDimensionsDialog;
