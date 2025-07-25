import { useEffect } from "react";

const useOrbitPanToggle = (orbitRef, key = "q") => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === key && orbitRef.current) {
        orbitRef.current.enablePan = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === key && orbitRef.current) {
        orbitRef.current.enablePan = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [orbitRef, key]);
};

export default useOrbitPanToggle;
