const DEFAULT_PECK = Object.freeze({
  depth: 66,
  duration: 5400,
  scale: 0.52,
  soundVolume: 0.4,
  tapInterval: 135,
  tapXOffset: 47,
  tapYOffset: -22,
  worldX: 2620,
  y: 318,
});

const PECK_ANIMATION_KEY = 'woodpecker-pecking';

const Phaser = window.Phaser;

export default class WoodpeckerPeckEvent {
  constructor(scene, eventConfig) {
    this.scene = scene;
    this.eventConfig = eventConfig;
  }

  play() {
    const peck = { ...DEFAULT_PECK, ...(this.eventConfig.peck ?? {}) };
    const bird = this.createBird(peck);
    const sound = this.playDrumming(peck);
    const bodyTween = this.createBodyMotion(bird, peck);
    const impactTimer = this.createImpactLoop(peck);

    this.scene.time.delayedCall(peck.duration, () => {
      impactTimer?.remove(false);
      bodyTween?.stop();
      sound?.stop();
      sound?.destroy();
      bird.destroy();
    });
  }

  createBird(peck) {
    this.ensureAnimation();

    return this.scene.add
      .sprite(peck.worldX, peck.y, this.eventConfig.assetKey)
      .setDepth(peck.depth)
      .setOrigin(0.5)
      .setScale(peck.scale)
      .play(PECK_ANIMATION_KEY);
  }

  ensureAnimation() {
    if (this.scene.anims.exists(PECK_ANIMATION_KEY)) {
      return;
    }

    this.scene.anims.create({
      key: PECK_ANIMATION_KEY,
      frames: this.scene.anims.generateFrameNumbers(this.eventConfig.assetKey, { start: 0, end: 5 }),
      frameRate: 16,
      repeat: -1,
    });
  }

  createBodyMotion(bird, peck) {
    return this.scene.tweens.add({
      targets: bird,
      x: peck.worldX + 4,
      angle: 2,
      duration: 95,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });
  }

  playDrumming(peck) {
    if (!this.eventConfig.soundKey || !this.hasCachedAudio(this.eventConfig.soundKey)) {
      return null;
    }

    const sound = this.scene.sound.add(this.eventConfig.soundKey, { volume: peck.soundVolume });
    sound.play();

    return sound;
  }

  hasCachedAudio(key) {
    const audioCache = this.scene.cache.audio;

    return Boolean(audioCache?.exists?.(key) || audioCache?.has?.(key));
  }

  createImpactLoop(peck) {
    return this.scene.time.addEvent({
      delay: peck.tapInterval,
      repeat: Math.floor(peck.duration / peck.tapInterval),
      callback: () => this.createTapDust(peck),
    });
  }

  createTapDust(peck) {
    const x = peck.trunkX ?? peck.worldX + peck.tapXOffset;
    const y = peck.tapY ?? peck.y + peck.tapYOffset;
    const fleck = this.scene.add
      .circle(
        x + Phaser.Math.Between(-2, 3),
        y + Phaser.Math.Between(-5, 5),
        Phaser.Math.FloatBetween(1.5, 2.6),
        0xf1d08a,
        0.8,
      )
      .setDepth(peck.depth + 1);

    this.scene.tweens.add({
      targets: fleck,
      x: fleck.x + Phaser.Math.Between(5, 13),
      y: fleck.y + Phaser.Math.Between(-4, 7),
      alpha: 0,
      scale: 0.25,
      duration: 260,
      ease: 'Sine.easeOut',
      onComplete: () => fleck.destroy(),
    });
  }
}
