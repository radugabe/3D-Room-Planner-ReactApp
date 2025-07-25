export function importProject(jsonData) {
  if (!jsonData || typeof jsonData !== "object") {
    throw new Error("Imported file not valid.");
  }

  const { plannerType } = jsonData;

  if (!plannerType || (plannerType !== "custom" && plannerType !== "rectangular")) {
    throw new Error("Planner type not valid.");
  }

  const state = {
    models: Array.isArray(jsonData.models) ? jsonData.models : [],
    floorTexture: jsonData.floorTexture || null
  };
  
  if (plannerType === "custom") {
    state.walls = Array.isArray(jsonData.walls) ? jsonData.walls : [];
  }
  if (plannerType === "rectangular") {
    state.roomSize = jsonData.room || null;
    state.wallTexture = jsonData.wallTexture || null;
  }

  return {
    plannerType,
    state
  };
}
