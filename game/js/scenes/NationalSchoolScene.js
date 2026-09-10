import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-09-10-sea-77';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-10-sea-77';

const Phaser = window.Phaser;

export default class NationalSchoolScene extends EnvironmentScene {
  constructor() {
    super(
      SCENE_KEYS.nationalSchool,
      ASSET_KEYS.creditsBackground,
      'Escola Nacional de Botânica Tropical',
    );
  }

  // Depois da última parada da jornada, os créditos sobem em uma cena própria.
  returnToTrail() {
    if (this.hasReturned) {
      return;
    }

    this.hasReturned = true;
    const completedJourneyState = this.completePhase();

    this.stopAmbientAudio();
    this.cameras.main.fadeOut(450, 10, 24, 18);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENE_KEYS.credits, { journeyState: completedJourneyState });
    });
  }
}
