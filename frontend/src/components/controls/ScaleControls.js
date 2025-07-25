import { UI, MODEL } from "../../utils/Constants";

const ScaleControls = ({ 
  scale = { x: 1, y: 1, z: 1 }, 
  onScaleChange, 
  selectedModel,
  uniformScale = false,
  setUniformScale
}) => {
  if (selectedModel === null) return null;

  const currentScale = {
    x: scale?.x ?? 1,
    y: scale?.y ?? 1,
    z: scale?.z ?? 1
  };

  const handleScaleChange = (axis, value) => {
    const numericValue = parseFloat(value);
    if (uniformScale) {
      onScaleChange({ x: numericValue, y: numericValue, z: numericValue });
    } else {
      onScaleChange({ ...currentScale, [axis]: numericValue });
    }
  };

  const resetScale = () => {
    onScaleChange(MODEL.DEFAULT_SCALE);
  };

  return (
    <div className="mb-6">
      <h4 className="mb-2 font-medium text-md text-dark">Scale</h4>

      <div className="flex items-center gap-2 mb-3 cursor-pointer 2xl:mb-4">
        <input
          id="uniform-scale-checkbox"
          type="checkbox"
          checked={uniformScale}
          onChange={(e) => setUniformScale(e.target.checked)}
          className="hidden"
        />
        <label
          htmlFor="uniform-scale-checkbox"
          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
            uniformScale ? 'bg-primary border-primary' : 'bg-white border-primary'
          }`}
        >
          {uniformScale && <span className="text-xs font-bold text-white">✔</span>}
        </label>
        <span className="text-sm font-medium text-dark">Uniform Scale</span>
      </div>

      {uniformScale ? (
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-dark">
            Uniform Scale: {currentScale.x.toFixed(2)}
          </label>
          <input
            type="range"
            min={UI.MIN_SCALE}
            max={UI.MAX_SCALE}
            step="0.01"
            value={currentScale.x}
            onChange={(e) => handleScaleChange('x', e.target.value)}
            className="w-full cursor-pointer appearance-none h-1 rounded bg-[#d6c3ae] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
          />
        </div>
      ) : (
        ['x', 'y', 'z'].map((axis) => (
          <div className="mb-4" key={axis}>
            <label className="block mb-1 text-sm font-medium text-dark">
              {axis.toUpperCase()}: {currentScale[axis].toFixed(2)}
            </label>
            <input
              type="range"
              min={UI.MIN_SCALE}
              max={UI.MAX_SCALE}
              step="0.01"
              value={currentScale[axis]}
              onChange={(e) => handleScaleChange(axis, e.target.value)}
              className="w-full appearance-none h-1 rounded bg-[#d6c3ae] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
            />
          </div>
        ))
      )}

      <button
        className="w-full mt-2 px-3 py-1.5 text-sm text-white bg-sand rounded-xl shadow hover:bg-primary transition xl:px-3 xl:py-1.5 lg:px-2.5 lg:py-1.5"
        onClick={resetScale}
      >
        Reset Scale
      </button>
    </div>
  );
};

export default ScaleControls;
