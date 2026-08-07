import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

const DEFAULT_LAYER_DEPTH = 0;
const DEFAULT_LAYER_FIT = 'coverHeight';
const MODULE_TYPE_STOP = 'stop';

export default class WorldModuleRenderer {
  constructor(scene, worldMap) {
    this.scene = scene;
    this.worldMap = worldMap;
  }

  render() {
    let cursorX = 0;
    const modules = [];
    const stops = [];

    this.worldMap.modules.forEach((moduleConfig, moduleIndex) => {
      const width = this.resolveModuleWidth(moduleConfig);
      const module = this.createModuleLayout(moduleConfig, moduleIndex, cursorX, width);

      this.renderModule(module);
      modules.push(module);

      if (module.type === MODULE_TYPE_STOP) {
        stops.push(this.createStopLayout(module, stops.length));
      }

      cursorX += width;
    });

    return {
      bounds: {
        x: 0,
        y: 0,
        width: Math.max(Math.ceil(cursorX), GAME_WIDTH),
        height: GAME_HEIGHT,
      },
      modules,
      stops,
    };
  }

  createModuleLayout(moduleConfig, moduleIndex, startX, width) {
    return {
      ...moduleConfig,
      index: moduleIndex,
      startX,
      width,
      endX: startX + width,
    };
  }

  createStopLayout(module, stopIndex) {
    const entryRatio = module.entryRatio ?? 0.5;

    return {
      ...module,
      stopIndex,
      entryX: module.startX + module.width * entryRatio,
    };
  }

  resolveModuleWidth(moduleConfig) {
    if (Number.isFinite(moduleConfig.width) && moduleConfig.width > 0) {
      return moduleConfig.width;
    }

    const firstLayer = moduleConfig.layers?.[0];

    if (!firstLayer) {
      throw new Error(`World module "${moduleConfig.id}" has no width and no layers.`);
    }

    const sourceImage = this.getSourceImage(firstLayer.assetKey);
    const scale = this.getLayerScale(sourceImage, GAME_WIDTH, firstLayer.fit ?? DEFAULT_LAYER_FIT);

    return Math.ceil(sourceImage.width * scale);
  }

  renderModule(module) {
    module.layers?.forEach((layerConfig) => this.renderLayer(module, layerConfig));
  }

  renderLayer(module, layerConfig) {
    const sourceImage = this.getSourceImage(layerConfig.assetKey);
    const scale = this.getLayerScale(sourceImage, module.width, layerConfig.fit ?? DEFAULT_LAYER_FIT);
    const displayWidth = sourceImage.width * scale;
    const displayHeight = sourceImage.height * scale;
    const x = module.startX + this.getAlignedOffset(layerConfig.alignX, module.width, displayWidth);
    const y = this.getAlignedOffset(layerConfig.alignY ?? 'start', GAME_HEIGHT, displayHeight);

    // Usa a textura inteira do modulo. Recortes e mascaras ficam fora do runtime.
    this.scene.add
      .image(x, y, layerConfig.assetKey)
      .setOrigin(0, 0)
      .setScale(scale)
      .setDepth(layerConfig.depth ?? DEFAULT_LAYER_DEPTH);
  }

  getSourceImage(assetKey) {
    if (!this.scene.textures.exists(assetKey)) {
      throw new Error(`World layer texture "${assetKey}" was not loaded.`);
    }

    return this.scene.textures.get(assetKey).getSourceImage();
  }

  getLayerScale(sourceImage, moduleWidth, fit) {
    const scaleX = moduleWidth / sourceImage.width;
    const scaleY = GAME_HEIGHT / sourceImage.height;

    if (fit === 'cover') {
      return Math.max(scaleX, scaleY);
    }

    if (fit === 'contain') {
      return Math.min(scaleX, scaleY);
    }

    if (fit === 'coverWidth') {
      return scaleX;
    }

    return scaleY;
  }

  getAlignedOffset(alignment = 'center', containerSize, contentSize) {
    if (alignment === 'start') {
      return 0;
    }

    if (alignment === 'end') {
      return containerSize - contentSize;
    }

    return (containerSize - contentSize) / 2;
  }
}
