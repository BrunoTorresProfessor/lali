const DEFAULT_JUMP = Object.freeze({
  distance: 150,
  duration: 1200,
  height: 120,
  moduleX: 780,
  scale: 0.42,
  soundVolume: 0.32,
  waterY: 350,
});

const Phaser = window.Phaser;

export default class FishJumpEvent {
  constructor(scene, eventConfig) {
    this.scene = scene;
    this.eventConfig = eventConfig;
  }

  play() {
    const jump = { ...DEFAULT_JUMP, ...(this.eventConfig.jump ?? {}) };
    const waterX = this.resolveWaterX(jump);
    const startX = waterX + jump.distance / 2;
    const endX = waterX - jump.distance / 2;
    const state = { progress: 0 };
    const fish = this.createFish(startX, jump.waterY, jump.scale);

    this.createStartRipple(startX, jump.waterY);

    this.scene.tweens.add({
      targets: state,
      progress: 1,
      duration: jump.duration,
      ease: 'Sine.easeInOut',
      onUpdate: () => this.updateFish(fish, state.progress, startX, endX, jump),
      onComplete: () => {
        fish.destroy();
        this.createSplash(endX, jump.waterY, jump.soundVolume);
      },
    });
  }

  resolveWaterX(jump) {
    if (Number.isFinite(jump.worldX)) {
      return jump.worldX;
    }

    return (this.eventConfig.stopStartX ?? 0) + jump.moduleX;
  }

  createFish(x, y, scale) {
    return this.scene.add
      .image(x, y + 12, this.eventConfig.assetKey)
      .setDepth(74)
      .setOrigin(0.5)
      .setScale(scale * 0.72)
      .setAlpha(0);
  }

  updateFish(fish, progress, startX, endX, jump) {
    const arc = Math.sin(Math.PI * progress);
    const x = Phaser.Math.Linear(startX, endX, progress);
    const y = jump.waterY - arc * jump.height + 12 * progress;
    const scalePulse = 0.72 + arc * 0.32;

    fish
      .setPosition(x, y)
      .setAngle(Phaser.Math.Linear(-38, 42, progress))
      .setAlpha(Math.min(1, arc * 2.8))
      .setScale(jump.scale * scalePulse);
  }

  createStartRipple(x, y) {
    this.createRipple(x, y, 42, 0.22);
  }

  createSplash(x, y, volume) {
    this.playSplashSound(volume);
    this.createRipple(x, y, 78, 0.5);
    this.createDroplets(x, y);
  }

  playSplashSound(volume) {
    if (!this.eventConfig.soundKey || !this.scene.cache.audio.exists(this.eventConfig.soundKey)) {
      return;
    }

    this.scene.sound.play(this.eventConfig.soundKey, { volume });
  }

  createRipple(x, y, width, alpha) {
    const ripple = this.scene.add.graphics().setDepth(73);

    ripple.lineStyle(3, 0xdffcff, alpha);
    ripple.strokeEllipse(0, 0, width, width * 0.28);
    ripple.setPosition(x, y + 6);

    this.scene.tweens.add({
      targets: ripple,
      alpha: 0,
      scaleX: 1.65,
      scaleY: 1.35,
      duration: 680,
      ease: 'Sine.easeOut',
      onComplete: () => ripple.destroy(),
    });
  }

  createDroplets(x, y) {
    const droplets = [-1, 0, 1].map((direction, index) => {
      const droplet = this.scene.add.circle(x, y, 4 - index * 0.6, 0xdffcff, 0.82).setDepth(75);
      const targetX = x + direction * (26 + index * 7);
      const targetY = y - 28 - index * 10;

      this.scene.tweens.add({
        targets: droplet,
        x: targetX,
        y: targetY,
        alpha: 0,
        duration: 520,
        ease: 'Sine.easeOut',
        onComplete: () => droplet.destroy(),
      });

      return droplet;
    });

    return droplets;
  }
}
