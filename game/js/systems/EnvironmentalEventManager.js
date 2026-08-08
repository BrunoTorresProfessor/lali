import FishJumpEvent from './FishJumpEvent.js?v=2026-08-08-fish-cache-33';
import ToucanFlybyEvent from './ToucanFlybyEvent.js?v=2026-08-08-fish-cache-33';

const EVENT_TYPES = Object.freeze({
  fishJump: 'fishJump',
  toucanFlyby: 'toucanFlyby',
});

export default class EnvironmentalEventManager {
  constructor(scene, formation, worldLayer, options = {}) {
    this.scene = scene;
    this.formation = formation;
    this.events = worldLayer.events ?? [];
    this.triggeredEventIds = this.getAlreadyCompletedEvents(options.currentStopIndex ?? 0);
  }

  update() {
    if (!this.events.length) {
      return;
    }

    const centerX = this.formation.getCenter().x;

    this.events.forEach((eventConfig) => {
      if (this.triggeredEventIds.has(eventConfig.id) || centerX < eventConfig.triggerX) {
        return;
      }

      this.triggerEvent(eventConfig);
    });
  }

  getAlreadyCompletedEvents(currentStopIndex) {
    const completedEvents = this.events
      .filter((eventConfig) => Number.isFinite(eventConfig.beforeStopIndex) && eventConfig.beforeStopIndex < currentStopIndex)
      .map((eventConfig) => eventConfig.id);

    return new Set(completedEvents);
  }

  triggerEvent(eventConfig) {
    this.triggeredEventIds.add(eventConfig.id);

    if (eventConfig.type === EVENT_TYPES.toucanFlyby) {
      new ToucanFlybyEvent(this.scene, this.formation, eventConfig).play();
    }

    if (eventConfig.type === EVENT_TYPES.fishJump) {
      new FishJumpEvent(this.scene, eventConfig).play();
    }
  }
}
