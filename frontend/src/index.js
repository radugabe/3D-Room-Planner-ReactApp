import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import resourceManager from "./utils/ResourceManager";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener('beforeunload', () => {
  resourceManager.clearUnused();
});

if (process.env.NODE_ENV !== 'production') {
  const performanceMonitor = setInterval(() => {
    const memoryInfo = window.performance.memory;
    if (memoryInfo) {
      console.log('Memory usage:', {
        totalJSHeapSize: Math.round(memoryInfo.totalJSHeapSize / (1024 * 1024)) + ' MB',
        usedJSHeapSize: Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024)) + ' MB',
        jsHeapSizeLimit: Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024)) + ' MB',
      });
    }
  }, 60000);

  window.addEventListener('beforeunload', () => {
    clearInterval(performanceMonitor);
  });
}