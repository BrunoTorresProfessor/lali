import { GAME_WIDTH, PLAYER_ANIMATION_STATES } from '../config.js?v=2026-09-10-sea-77';
import SpeechBubble from '../ui/SpeechBubble.js?v=2026-09-10-sea-77';

const DEFAULT_RUN = Object.freeze({
  depth: 9,
  duration: 2400,
  endPadding: 170,
  scale: 0.2,
  shadowOffsetY: 42,
  startPadding: 120,
  y: 638,
});

export default class CapuchinRunEvent {
  constructor(scene, formation, eventConfig) {
    this.scene = scene;
    this.formation = formation;
    this.eventConfig = eventConfig;
  }

  play() {
    const run = { ...DEFAULT_RUN, ...(this.eventConfig.run ?? {}) };
    const camera = this.scene.cameras.main;
    const startX = camera.scrollX - run.startPadding;
    const endX = camera.scrollX + GAME_WIDTH + run.endPadding;
    const y = camera.scrollY + run.y;
    const monkey = this.createMonkey(startX, y, run);
    const shadow = this.createShadow(startX, y, run);
    const bobTween = this.createRunningBob(monkey);

    this.scene.tweens.add({
      targets: [monkey, shadow],
      x: endX,
      duration: run.duration,
      ease: 'Linear',
      onComplete: () => {
        bobTween.stop();
        monkey.destroy();
        shadow.destroy();
      },
    });

    this.showSpeech();
  }

  createMonkey(x, y, run) {
    return this.scene.add
      .image(x, y, this.eventConfig.assetKey)
      .setDepth(run.depth)
      .setOrigin(0.5)
      .setScale(run.scale);
  }

  createShadow(x, y, run) {
    return this.scene.add
      .ellipse(x, y + run.shadowOffsetY, 120, 26, 0x1f2717, 0.16)
      .setDepth(run.depth - 1);
  }

  createRunningBob(monkey) {
    return this.scene.tweens.add({
      targets: monkey,
      y: monkey.y - 10,
      angle: 2,
      duration: 170,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
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
