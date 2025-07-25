const ViewControls = ({ moveVertical, toggleMoveVertical }) => {
  return (
    <div>
      <div className="
        flex items-center bg-sand rounded-lg
        gap-2 xl:gap-3
        p-2 xl:p-3"
      >
        <label className="flex items-center gap-2 xl:gap-3 text-xs xl:text-sm font-medium text-light cursor-pointer">
          <input
            type="checkbox"
            checked={moveVertical}
            onChange={toggleMoveVertical}
            className="w-4 h-4 xl:w-5 xl:h-5 accent-accent cursor-pointer rounded focus:ring-2 focus:ring-primaryDark"
          />
          Move Vertically
        </label>
      </div>
    </div>
  );
};

export default ViewControls;
