import CapuchinRunEvent from './CapuchinRunEvent.js?v=2026-08-26-seed-reward-sound-58';
import FishJumpEvent from './FishJumpEvent.js?v=2026-08-26-seed-reward-sound-58';
import ToucanFlybyEvent from './ToucanFlybyEvent.js?v=2026-08-26-seed-reward-sound-58';
import WoodpeckerPeckEvent from './WoodpeckerPeckEvent.js?v=2026-08-26-seed-reward-sound-58';

const EVENT_TYPES = Object.freeze({
  capuchinRun: 'capuchinRun',
  fishJump: 'fishJump',
  toucanFlyby: 'toucanFlyby',
  woodpeckerPeck: 'woodpeckerPeck',
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

    if (eventConfig.type === EVENT_TYPES.capuchinRun) {
      new CapuchinRunEvent(this.scene, this.formation, eventConfig).play();
    }

    if (eventConfig.type === EVENT_TYPES.fishJump) {
      new FishJumpEvent(this.scene, eventConfig).play();
    }

    if (eventConfig.type === EVENT_TYPES.woodpeckerPeck) {
      new WoodpeckerPeckEvent(this.scene, eventConfig).play();
    }
  }
}
