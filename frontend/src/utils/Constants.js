export const API_URL = "http://localhost:5000";

export const PERFORMANCE = {
  THROTTLE_DELAY: 16,
  MAX_TEXTURE_SIZE: 2048,
  TEXTURE_REPEAT: 2,
  LOD_DISTANCES: [5, 10, 20],
};

export const UI = {
  SIDEBAR_WIDTH: 300,
  DEFAULT_EDIT_MODE: 'move',
  ANIMATION_DURATION: 300,
  TOOLBAR_HEIGHT: 50,
  MAX_SCALE: 10,
  MIN_SCALE: 0.01,
  ROTATION_STEP: 0.1,
};

export const SCENE = {
  DEFAULT_ROOM_SIZE: { width: 5, height: 4, depth: 5 },
  DEFAULT_CAMERA_POSITION: [-5, 5, 10],
  CAMERA_FOV: 50,
  AMBIENT_LIGHT_INTENSITY: 0.9,
  DIRECTIONAL_LIGHT_INTENSITY: 1.1,
  GRID_CELL_SIZE: 0.5,
  FLOOR_HEIGHT_OFFSET: 0.01,
};

export const MATERIALS = {
  FLOOR: {
    roughness: 0.7,
    metalness: 0.1,
  },
  WALL: {
    roughness: 0.9,
    metalness: 0.0,
  },
  MODEL: {
    roughness: 0.8,
    metalness: 0.2,
  }
};

export const CACHE = {
  MAX_TEXTURES: 50,
  MAX_MODELS: 20,
  CLEANUP_INTERVAL: 5 * 60 * 1000,
  MAX_UNUSED_TIME: 10 * 60 * 1000,
};

export const MODEL = {
  DEFAULT_SCALE: { x: 1, y: 1, z: 1 },
  DEFAULT_ROTATION: [0, 0, 0],
  VERTICAL_LIMIT_OFFSET: 0.08,
  ROTATION_DISPLAY_MULTIPLIER: 180 / Math.PI,
};

export const COLORS = {
  WALL: "#ffffff",
  FLOOR: "#d3d3d3",
  CEILING: "#f5f5f5",
  GRID_CELL: "#6f8a91",
  GRID_SECTION: "#2c3e50",
  SELECTED: "#b07a36",
  BACKGROUND: "#ffffff",
  PLACEHOLDER: "#cccccc",
  primary: '#C9B29B',
  primaryDark: '#A68C72',
  accent: '#8B6B4F',
  light: '#F5F1EC',
  dark: '#4D3E33', 
  white: '#ffffff'
};

export const STRINGS = {
  plannerTitle: 'Planner 3D',
  toolbar: {
    addWall: 'Adaugă perete',
    editModel: 'Editează model',
  }
};