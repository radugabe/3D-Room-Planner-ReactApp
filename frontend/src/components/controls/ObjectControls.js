import React from "react";
import ScaleControls from "./ScaleControls";
import useObjectControlsManager from "../../hooks/useObjectControlsManager";

function ObjectControls({
  selectedModelIndex,
  getSelectedModelRotation,
  getSelectedModelScale,
  handleRotation,
  handleScaleChange
}) {
  const {
    uniformScale,
    setUniformScale,
    handleRotationChange,
    getRotationDegrees,
    getRotationRadians,
  } = useObjectControlsManager(getSelectedModelRotation, handleRotation);

  if (selectedModelIndex === null) return null;

  return (
    <div className="absolute top-[70px] right-3 z-[1000] w-[280px] xl:w-[260px] lg:w-[240px] bg-white border border-[#c2ad97] rounded-xl shadow-xl p-5 xl:p-4 lg:p-3">
      <h3 className="text-base xl:text-sm font-semibold text-dark border-b border-gray-200 pb-1.5 mb-3">
        Object Properties
      </h3>

      <div className="mb-6">
        <h4 className="mb-2 font-medium text-md text-dark">Rotation</h4>

        {['x', 'y', 'z'].map((axis, i) => (
          <div className="flex flex-col gap-1 mb-4" key={axis}>
            <div className="flex items-center gap-3">
              <label className="w-4 text-sm font-medium text-right text-dark">
                {axis.toUpperCase()}:
              </label>
              <input
                type="number"
                value={getRotationDegrees(i)}
                onChange={(e) =>
                  handleRotationChange(axis, parseFloat(e.target.value) * (Math.PI / 180))
                }
                className="h-8 text-sm text-center border rounded-md w-14 xl:w-12"
              />
              <input
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step={0.1}
                value={getRotationRadians(i)}
                onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value))}
                className="flex-1 cursor-pointer appearance-none h-1 rounded bg-[#d6c3ae]
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
              />
            </div>
          </div>
        ))}

        <button
          className="w-full mt-2 px-3 py-1.5 text-sm text-white bg-sand rounded-xl shadow hover:bg-primary transition xl:px-3 xl:py-1.5 lg:px-2.5 lg:py-1.5"
          onClick={() => handleRotationChange("reset")}
        >
          Reset Rotation
        </button>
      </div>

      <ScaleControls
        scale={getSelectedModelScale()}
        onScaleChange={handleScaleChange}
        selectedModel={selectedModelIndex}
        uniformScale={uniformScale}
        setUniformScale={setUniformScale}
      />
    </div>
  );
}

export default ObjectControls;