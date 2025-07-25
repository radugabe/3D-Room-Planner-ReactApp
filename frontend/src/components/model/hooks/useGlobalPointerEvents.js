import { useEffect } from "react";

export function useGlobalPointerEvents(handleGlobalPointerMove, handleGlobalPointerUp) {
  useEffect(() => {
    let lastTime = 0;
    const throttleDuration = 16;

    const throttledPointerMove = (e) => {
      const now = Date.now();
      if (now - lastTime >= throttleDuration) {
        lastTime = now;
        handleGlobalPointerMove(e);
      }
    };

    window.addEventListener("pointermove", throttledPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointerleave", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("pointermove", throttledPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointerleave", handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);
}
