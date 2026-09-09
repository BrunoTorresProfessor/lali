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
    const sourceRect = layerConfig.sourceRect;
    const sourceSize = sourceRect ?? sourceImage;
    const scale = this.getLayerScale(sourceSize, module.width, layerConfig.fit ?? DEFAULT_LAYER_FIT);
    const displayWidth = sourceSize.width * scale;
    const displayHeight = sourceSize.height * scale;
    const x = module.startX + this.getAlignedOffset(layerConfig.alignX, module.width, displayWidth);
    const y = this.getAlignedOffset(layerConfig.alignY ?? 'start', GAME_HEIGHT, displayHeight);

    // Adjacent stops can share one continuous painting without inserting a
    // standalone environment image into the trail or stretching the scenery.
    let frame;
    if (sourceRect) {
      const { x: sourceX, y: sourceY, width, height } = sourceRect;
      if (![sourceX, sourceY, width, height].every(Number.isFinite)
        || sourceX < 0 || sourceY < 0 || width <= 0 || height <= 0
        || sourceX + width > sourceImage.width || sourceY + height > sourceImage.height) {
        throw new Error(`Invalid sourceRect for world layer "${layerConfig.assetKey}".`);
      }
      frame = `world-region-${sourceX}-${sourceY}-${width}-${height}`;
      const texture = this.scene.textures.get(layerConfig.assetKey);
      if (!texture.has(frame)) texture.add(frame, 0, sourceX, sourceY, width, height);
    }

    this.scene.add
      .image(x, y, layerConfig.assetKey, frame)
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
