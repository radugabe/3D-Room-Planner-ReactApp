const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex flex-col justify-center items-center z-[1000] transition-opacity duration-300 ease-in-out">
      <div className="w-[50px] h-[50px] border-[5px] border-t-[5px] border-white/20 border-t-accent rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg font-medium drop-shadow-md animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingOverlay;