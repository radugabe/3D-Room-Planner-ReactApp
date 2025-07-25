import React from 'react';

export const throttle = (func, limit) => {
  let lastCall = 0;
  let timeoutId = null;
  
  return function(...args) {
    const now = Date.now();
    const context = this;
    
    if (now - lastCall < limit) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = now;
        func.apply(context, args);
      }, limit);
    } else {
      lastCall = now;
      func.apply(context, args);
    }
  };
};

export const debounce = (func, delay) => {
  let timeoutId;
  
  return function(...args) {
    const context = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export const useThrottledCallback = (callback, delay) => {
  const throttledCallback = React.useCallback(
    throttle(callback, delay),
    [callback, delay]
  );
  
  return throttledCallback;
};

export const measurePerformance = (func, name) => {
  return function(...args) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    
    console.log(`${name || 'Function'} took ${end - start}ms to execute`);
    
    return result;
  };
};

export const useDragHandler = (callback, fps = 60) => {
  const interval = 1000 / fps;
  const previousCall = React.useRef(0);
  const requestRef = React.useRef();
  
  const animate = React.useCallback((time) => {
    if (time - previousCall.current >= interval) {
      previousCall.current = time;
      callback();
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [callback, interval]);
  
  const start = React.useCallback(() => {
    if (!requestRef.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);
  
  const stop = React.useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    return () => stop();
  }, [stop]);
  
  return { start, stop };
};