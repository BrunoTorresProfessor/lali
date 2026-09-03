import { GAME_WIDTH, PLAYER_ANIMATION_STATES } from '../config.js?v=2026-09-01-monkey-guidance-70';
import SpeechBubble from '../ui/SpeechBubble.js?v=2026-09-01-monkey-guidance-70';

const DEFAULT_FLIGHT = Object.freeze({
  duration: 4800,
  endPadding: 220,
  scale: 0.25,
  startPadding: 80,
  y: 132,
});

export default class ToucanFlybyEvent {
  constructor(scene, formation, eventConfig) {
    this.scene = scene;
    this.formation = formation;
    this.eventConfig = eventConfig;
  }

  play() {
    const flight = { ...DEFAULT_FLIGHT, ...(this.eventConfig.flight ?? {}) };
    const camera = this.scene.cameras.main;
    const startX = camera.scrollX + GAME_WIDTH + flight.startPadding;
    const endX = camera.scrollX - flight.endPadding;
    const startY = camera.scrollY + flight.y;
    const toucan = this.scene.add
      .image(startX, startY, this.eventConfig.assetKey)
      .setDepth(72)
      .setOrigin(0.5)
      .setScale(flight.scale);

    const bobTween = this.scene.tweens.add({
      targets: toucan,
      y: startY + 18,
      duration: 760,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    this.scene.tweens.add({
      targets: toucan,
      x: endX,
      angle: -4,
      duration: flight.duration,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        bobTween.stop();
        toucan.destroy();
      },
    });

    this.showSpeech();
  }

  showSpeech() {
    const speech = this.eventConfig.speech;

    if (!speech?.text) {
      return;
    }

    this.formation.girlOne.playState(PLAYER_ANIMATION_STATES.talk);
    new SpeechBubble(this.scene, this.formation.girlOne, speech.text, {
      duration: speech.duration,
      speaker: speech.speaker,
    });
  }
}
