import { useState } from "react";

function useSidebarManager() {
  const [collapsedSections, setCollapsedSections] = useState({
    models: false,
    textures: false,
    controls: false,
    selected: false
  });

  const toggleSectionCollapse = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    collapsedSections,
    toggleSectionCollapse
  };
}

export default useSidebarManager;
