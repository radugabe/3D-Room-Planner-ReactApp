import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class ResourceManager {
  constructor() {
    this.textureCache = new Map();
    this.modelCache = new Map();
    this.textureLoader = new THREE.TextureLoader();
    this.modelLoader = new GLTFLoader();
    this.loadingModels = new Map();
    this.loadingTextures = new Map();
  }

  loadTexture(path, options = {}) {
    if (this.textureCache.has(path)) {
      return Promise.resolve(this.textureCache.get(path));
    }

    if (this.loadingTextures.has(path)) {
      return this.loadingTextures.get(path);
    }

    const loadingPromise = new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          if (options.repeat) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1);
          }
          this.textureCache.set(path, texture);
          this.loadingTextures.delete(path);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Failed to load texture: ${path}`, error);
          this.loadingTextures.delete(path);
          reject(error);
        }
      );
    });

    this.loadingTextures.set(path, loadingPromise);
    return loadingPromise;
  }

  async loadMaterialSet(basePath, materialName) {
    const textureSet = {};
    const colorPath = `${basePath}/${materialName}_Color.jpg`;
    const normalPath = `${basePath}/${materialName}_Normal.jpg`;
    const roughnessPath = `${basePath}/${materialName}_Roughness.jpg`;

    try {
      const [colorTexture, normalTexture, roughnessTexture] = await Promise.allSettled([
        this.loadTexture(colorPath, { repeat: { x: 2, y: 2 } }),
        this.loadTexture(normalPath, { repeat: { x: 2, y: 2 } }),
        this.loadTexture(roughnessPath, { repeat: { x: 2, y: 2 } })
      ]);

      if (colorTexture.status === 'fulfilled') textureSet.map = colorTexture.value;
      if (normalTexture.status === 'fulfilled') textureSet.normalMap = normalTexture.value;
      if (roughnessTexture.status === 'fulfilled') textureSet.roughnessMap = roughnessTexture.value;

      return textureSet;
    } catch (error) {
      console.error(`Error loading material set for ${materialName}:`, error);
      return {};
    }
  }

  loadModel(path) {
    if (this.modelCache.has(path)) {
      return Promise.resolve(this.modelCache.get(path));
    }

    if (this.loadingModels.has(path)) {
      return this.loadingModels.get(path);
    }

    const loadingPromise = new Promise((resolve, reject) => {
      this.modelLoader.load(
        path,
        (gltf) => {
          this.optimizeModel(gltf);
          this.modelCache.set(path, gltf);
          this.loadingModels.delete(path);
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error(`Failed to load model: ${path}`, error);
          this.loadingModels.delete(path);
          reject(error);
        }
      );
    });

    this.loadingModels.set(path, loadingPromise);
    return loadingPromise;
  }

  optimizeModel(gltf) {
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        node.frustumCulled = false;
        if (node.geometry && !node.geometry.attributes.position.normalized) {
          node.geometry.computeBoundingSphere();
          node.geometry.computeBoundingBox();
        }
        if (node.material) {
          node.material.dithering = false;
        }
      }
    });

    return gltf;
  }

  createMaterial(textureSet, isSelected = false) {
    const material = new THREE.MeshStandardMaterial({
      map: textureSet.map || null,
      normalMap: textureSet.normalMap || null,
      roughnessMap: textureSet.roughnessMap || null,
      metalness: 0.2,
      roughness: 0.8
    });

    if (isSelected) {
      material.emissive = new THREE.Color(0xb07a36);
      material.emissiveIntensity = 0.2;
      material.transparent = true;
      material.opacity = 0.8;
    }

    return material;
  }

  clearUnused() {
    const now = Date.now();
    for (const [path, texture] of this.textureCache.entries()) {
      if (texture.lastUsed && now - texture.lastUsed > 5 * 60 * 1000) {
        texture.dispose();
        this.textureCache.delete(path);
      }
    }
  }
}

const resourceManager = new ResourceManager();
export default resourceManager;
