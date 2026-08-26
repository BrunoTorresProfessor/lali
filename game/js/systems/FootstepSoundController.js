import { ASSET_KEYS, FOOTSTEP_AUDIO } from '../config.js?v=2026-08-26-seed-reward-sound-58';

const Phaser = window.Phaser;

export default class FootstepSoundController {
  constructor(scene, formation) {
    this.scene = scene;
    this.formation = formation;
    this.nextStepAt = 0;
    this.stepIndex = 0;
    this.sounds = this.createSounds();

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  createSounds() {
    return [ASSET_KEYS.footstepSoftA, ASSET_KEYS.footstepSoftB]
      .filter((key) => this.hasCachedAudio(key))
      .map((key) => this.scene.sound.add(key, { volume: FOOTSTEP_AUDIO.volume }));
  }

  hasCachedAudio(key) {
    const audioCache = this.scene.cache.audio;

    return Boolean(audioCache?.exists?.(key) || audioCache?.has?.(key));
  }

  update() {
    if (!this.canPlaySteps()) {
      this.nextStepAt = 0;
      return;
    }

    if (this.scene.time.now < this.nextStepAt) {
      return;
    }

    this.playNextStep();
    this.nextStepAt = this.scene.time.now + FOOTSTEP_AUDIO.intervalMs;
  }

  canPlaySteps() {
    return this.sounds.length > 0 && !this.scene.sound.locked && this.formation.isMoving();
  }

  playNextStep() {
    const sound = this.sounds[this.stepIndex % this.sounds.length];
    const rate = 1 + Phaser.Math.FloatBetween(-FOOTSTEP_AUDIO.rateVariation, FOOTSTEP_AUDIO.rateVariation);

    sound.play({ rate, volume: FOOTSTEP_AUDIO.volume });
    this.stepIndex += 1;
  }

  destroy() {
    this.sounds.forEach((sound) => {
      sound.stop();
      sound.destroy();
    });
    this.sounds = [];
  }
}
