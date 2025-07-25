export function exportProject({ plannerType, roomSize, walls, models, wallTexture, floorTexture }) {
  const projectData = {
    plannerType,
    timestamp: new Date().toISOString(),
    room: plannerType === "rectangular" ? roomSize : null,
    walls: walls.map(w => ({
      id: w.id,
      startPoint: w.startPoint,
      endPoint: w.endPoint,
      height: w.height,
      thickness: w.thickness,
      angle: w.angle,
      texture: w.texture || null
    })),
    models: models.map(m => ({
      id: m.id,
      modelPath: m.modelPath,
      position: m.position,
      rotation: m.rotation,
      scale: m.scale,
      texturePath: m.texturePath || null
    })),
    wallTexture: plannerType === "rectangular" ? wallTexture : null,
    floorTexture: floorTexture
  };

  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "project.json";
  a.click();
  URL.revokeObjectURL(url);
}
