import { SCENE_KEYS } from '../config.js';

const Phaser = window.Phaser;

export default class JourneyManager {
  constructor(scene, formation, worldLayer, options = {}) {
    this.scene = scene;
    this.formation = formation;
    this.worldLayer = worldLayer;
    this.stops = worldLayer.stops;
    this.currentStopIndex = options.currentStopIndex ?? 0;
    this.isTransitioning = false;
  }

  update() {
    if (this.isTransitioning || this.isJourneyComplete()) {
      return;
    }

    this.checkCurrentStop();
  }

  checkCurrentStop() {
    const currentStop = this.getCurrentStop();

    if (!currentStop) {
      return;
    }

    if (this.formation.getCenter().x >= this.getStopCenterX(currentStop)) {
      this.enterEnvironment(currentStop);
    }
  }

  getCurrentStop() {
    return this.stops[this.currentStopIndex];
  }

  getSegmentDistance() {
    const currentStop = this.getCurrentStop();

    if (!currentStop) {
      return 0;
    }

    return Math.max(0, this.formation.getCenter().x - currentStop.startX);
  }

  getStopCenterX(stop) {
    return stop.entryX;
  }

  isJourneyComplete() {
    return this.currentStopIndex >= this.stops.length;
  }

  enterEnvironment(stop) {
    if (!stop.scene) {
      this.currentStopIndex += 1;
      return;
    }

    this.isTransitioning = true;
    this.formation.stop();

    this.scene.cameras.main.fadeOut(450, 10, 24, 18);
    this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.scene.start(stop.scene, this.createEnvironmentPayload());
    });
  }

  createEnvironmentPayload() {
    const currentStop = this.getCurrentStop();

    return {
      returnScene: SCENE_KEYS.game,
      title: currentStop.title,
      journeyState: {
        currentStopIndex: this.currentStopIndex + 1,
        resumeCenterX: this.worldLayer.getResumeCenterX(currentStop),
      },
    };
  }
}
