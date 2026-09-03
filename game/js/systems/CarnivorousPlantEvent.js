import { ASSET_KEYS } from '../config.js?v=2026-09-01-monkey-guidance-70';

const Phaser = window.Phaser;

const PLANT_X = 1000;
const PLANT_Y = 620;
const PLANT_SIZE = 320;

export default class CarnivorousPlantEvent {
  constructor(scene, callbacks = {}) {
    this.scene = scene;
    this.onSnap = callbacks.onSnap;
    this.onComplete = callbacks.onComplete;
    this.audioNodes = [];

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  play(delay = 1600) {
    this.createPlant();
    this.scene.time.delayedCall(delay, () => this.startFly());
  }

  createPlant() {
    this.plant = this.scene.add
      .image(PLANT_X, PLANT_Y, ASSET_KEYS.carnivorousPlantOpen)
      .setOrigin(0.5, 1)
      .setDisplaySize(PLANT_SIZE, PLANT_SIZE)
      .setDepth(4);
  }

  startFly() {
    const startX = -50;
    const endX = 1050;

    this.fly = this.scene.add
      .image(startX, 300, ASSET_KEYS.greenhouseFly)
      .setDisplaySize(42, 42)
      .setDepth(8);

    this.startBuzzSound();

    this.flyTween = this.scene.tweens.add({
      targets: this.fly,
      x: endX,
      duration: 3300,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        if (!this.fly?.active) {
          return;
        }

        const progress = Phaser.Math.Clamp((this.fly.x - startX) / (endX - startX), 0, 1);
        this.fly.y = 300 + progress * 90 + Math.sin(progress * Math.PI * 7) * 38;
        this.fly.angle = Math.sin(progress * Math.PI * 9) * 8;
      },
      onComplete: () => this.snapPlant(),
    });
  }

  snapPlant() {
    if (!this.plant?.active) {
      return;
    }

    this.stopBuzzSound();
    const restingScale = this.plant.scaleX;

    this.scene.tweens.add({
      targets: this.plant,
      x: PLANT_X + 24,
      y: PLANT_Y - 18,
      scaleX: restingScale * 1.08,
      scaleY: restingScale * 1.08,
      duration: 135,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.fly?.destroy();
        this.fly = null;
        this.plant.setTexture(ASSET_KEYS.carnivorousPlantClosed);
        this.playSnapSound();
        this.onSnap?.();

        this.scene.tweens.add({
          targets: this.plant,
          x: PLANT_X,
          y: PLANT_Y,
          scaleX: restingScale,
          scaleY: restingScale,
          duration: 240,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.scene.time.delayedCall(1100, () => this.onComplete?.());
          },
        });
      },
    });
  }

  getAudioContext() {
    const context = this.scene.sound.context;

    if (!context?.createOscillator || context.state !== 'running') {
      return null;
    }

    return context;
  }

  startBuzzSound() {
    const context = this.getAudioContext();

    if (!context) {
      return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const modulation = context.createOscillator();
    const modulationGain = context.createGain();
    const gain = context.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(165, now);
    modulation.type = 'sine';
    modulation.frequency.setValueAtTime(38, now);
    modulationGain.gain.setValueAtTime(22, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.08);

    modulation.connect(modulationGain);
    modulationGain.connect(oscillator.frequency);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    modulation.start(now);

    this.audioNodes = [oscillator, modulation, modulationGain, gain];
  }

  stopBuzzSound() {
    const context = this.getAudioContext();

    if (!this.audioNodes.length) {
      return;
    }

    const [oscillator, modulation, , gain] = this.audioNodes;
    const stopAt = (context?.currentTime ?? 0) + 0.05;

    if (context) {
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
    }

    try {
      oscillator.stop(stopAt);
      modulation.stop(stopAt);
    } catch {
      // Os osciladores podem ja ter sido encerrados durante a troca de cena.
    }

    this.audioNodes = [];
  }

  playSnapSound() {
    const context = this.getAudioContext();

    if (!context) {
      return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const oscillatorGain = context.createGain();
    const sampleCount = Math.floor(context.sampleRate * 0.13);
    const noiseBuffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let index = 0; index < sampleCount; index += 1) {
      const decay = 1 - index / sampleCount;
      noiseData[index] = (Math.random() * 2 - 1) * decay;
    }

    const noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(190, now);
    oscillator.frequency.exponentialRampToValueAtTime(62, now + 0.12);
    oscillatorGain.gain.setValueAtTime(0.12, now);
    oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    noise.buffer = noiseBuffer;
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1700, now);
    noiseGain.gain.setValueAtTime(0.1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(context.destination);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
    noise.start(now);
    noise.stop(now + 0.14);
  }

  destroy() {
    this.stopBuzzSound();
    this.flyTween?.stop();
    this.fly?.destroy();
    this.plant?.destroy();
  }
}
