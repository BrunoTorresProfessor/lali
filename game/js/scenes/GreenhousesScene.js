import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-09-01-monkey-guidance-70';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-01-monkey-guidance-70';

const Phaser = window.Phaser;

export default class GreenhousesScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.greenhouses, ASSET_KEYS.greenhouses, 'Estufas');
  }

  returnToTrail() {
    if (this.hasReturned || !this.returnScene) {
      return;
    }

    this.hasReturned = true;
    const completedJourneyState = this.completePhase();

    this.stopAmbientAudio();
    this.cameras.main.fadeOut(450, 10, 24, 18);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENE_KEYS.carnivorousGreenhouse, {
        returnScene: this.returnScene,
        title: 'Estufa das Plantas Carnívoras',
        journeyState: completedJourneyState,
        entryRewardAmount: completedJourneyState.seedRewardAmount,
      });
    });
  }
}
