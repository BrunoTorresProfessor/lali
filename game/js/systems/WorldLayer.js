import { JOURNEY_RETURN_OFFSET } from '../config.js';
import WorldMapRepository from './WorldMapRepository.js';
import WorldModuleRenderer from './WorldModuleRenderer.js?v=2026-09-09-cactario-trilha-72';

export default class WorldLayer {
  constructor(scene) {
    this.scene = scene;
    this.worldMap = WorldMapRepository.get(scene);
    this.renderer = new WorldModuleRenderer(scene, this.worldMap);
    this.layout = this.renderer.render();
    this.modules = this.layout.modules;
    this.stops = this.layout.stops;
    this.bounds = this.layout.bounds;
    this.events = this.createEventLayouts(this.worldMap.events ?? []);

    this.scene.physics.world.setBounds(0, 0, this.bounds.width, this.bounds.height);
  }

  getStop(stopIndex) {
    return this.stops[stopIndex];
  }

  getResumeCenterX(stop) {
    const offset = stop.resumeOffset ?? JOURNEY_RETURN_OFFSET;

    return this.clampCenterX(stop.endX + offset);
  }

  createEventLayouts(events) {
    return events.map((eventConfig) => this.createEventLayout(eventConfig)).filter(Boolean);
  }

  createEventLayout(eventConfig) {
    const beforeStop = this.findStop(eventConfig.beforeStopId);
    const triggerX = Number.isFinite(eventConfig.triggerX)
      ? eventConfig.triggerX
      : beforeStop.entryX - (eventConfig.triggerOffsetFromEntry ?? 600);

    return {
      ...eventConfig,
      beforeStopIndex: beforeStop.stopIndex,
      stopStartX: beforeStop.startX,
      stopEntryX: beforeStop.entryX,
      triggerX: this.clampCenterX(triggerX),
    };
  }

  findStop(stopId) {
    const stop = this.stops.find((candidate) => candidate.id === stopId || candidate.sourceStopId === stopId);

    if (!stop) {
      throw new Error(`World event references unknown stop "${stopId}".`);
    }

    return stop;
  }

  clampCenterX(centerX) {
    return Math.min(Math.max(centerX, this.bounds.x), this.bounds.width);
  }
}
