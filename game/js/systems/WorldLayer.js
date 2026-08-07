import { JOURNEY_RETURN_OFFSET } from '../config.js';
import WorldMapRepository from './WorldMapRepository.js';
import WorldModuleRenderer from './WorldModuleRenderer.js';

export default class WorldLayer {
  constructor(scene) {
    this.scene = scene;
    this.worldMap = WorldMapRepository.get(scene);
    this.renderer = new WorldModuleRenderer(scene, this.worldMap);
    this.layout = this.renderer.render();
    this.modules = this.layout.modules;
    this.stops = this.layout.stops;
    this.bounds = this.layout.bounds;

    this.scene.physics.world.setBounds(0, 0, this.bounds.width, this.bounds.height);
  }

  getStop(stopIndex) {
    return this.stops[stopIndex];
  }

  getResumeCenterX(stop) {
    const offset = stop.resumeOffset ?? JOURNEY_RETURN_OFFSET;

    return this.clampCenterX(stop.endX + offset);
  }

  clampCenterX(centerX) {
    return Math.min(Math.max(centerX, this.bounds.x), this.bounds.width);
  }
}
