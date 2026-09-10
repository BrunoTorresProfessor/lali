import { ASSET_KEYS, GAME_WIDTH } from '../config.js?v=2026-09-10-sea-77';
import PhaseMap from './PhaseMap.js?v=2026-09-10-sea-77';

const Phaser = window.Phaser;

export default class GameHud {
  constructor(scene, girlOne, girlTwo, options = {}) {
    this.scene = scene;
    this.girlOne = girlOne;
    this.girlTwo = girlTwo;
    this.seedCount = options.seedCount ?? 0;
    this.seedReward = options.seedReward ?? 0;
    this.titleText = this.createTitleText();
    this.fpsText = this.createFpsText();
    this.seedCounter = this.createSeedCounter();
    this.positionText = this.createPositionText();
    this.phaseMap = new PhaseMap(this.scene, {
      currentStopIndex: options.currentStopIndex,
      onSelect: options.onPhaseSelect,
    });

    this.update();
    this.showSeedRewardIfNeeded();
  }

  createTitleText() {
    return this.scene.add
      .text(18, 16, 'Irmãs LaLi no Jardim', {
        color: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        stroke: '#1b2a20',
        strokeThickness: 4,
      })
      .setDepth(100)
      .setScrollFactor(0);
  }

  createFpsText() {
    return this.scene.add
      .text(GAME_WIDTH - 18, 16, '', {
        align: 'right',
        color: '#ffffff',
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: '18px',
        lineSpacing: 4,
        stroke: '#1b2a20',
        strokeThickness: 4,
      })
      .setDepth(100)
      .setOrigin(1, 0)
      .setScrollFactor(0);
  }

  createSeedCounter() {
    const container = this.scene.add.container(GAME_WIDTH - 18, 48).setDepth(100).setScrollFactor(0);
    const background = this.scene.add
      .rectangle(-48, 16, 96, 34, 0x10271c, 0.52)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xf2d278, 0.55);
    const icon = this.scene.add.image(-76, 16, ASSET_KEYS.seedIcon).setDisplaySize(31, 31);
    const valueText = this.scene.add
      .text(-52, 16, String(this.seedCount), {
        color: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '22px',
        fontStyle: 'bold',
        stroke: '#1b2a20',
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5);

    container.add([background, icon, valueText]);

    return { container, icon, valueText };
  }

  createPositionText() {
    return this.scene.add
      .text(GAME_WIDTH - 18, 88, '', {
        align: 'right',
        color: '#ffffff',
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: '18px',
        lineSpacing: 4,
        stroke: '#1b2a20',
        strokeThickness: 4,
      })
      .setDepth(100)
      .setOrigin(1, 0)
      .setScrollFactor(0);
  }

  update() {
    const fps = Math.round(this.scene.game.loop.actualFps || 0);

    this.fpsText.setText(`FPS: ${fps}`);
    this.seedCounter.valueText.setText(String(this.seedCount));
    this.positionText.setText([
      `Laurinha: x=${Math.round(this.girlOne.x)} y=${Math.round(this.girlOne.y)}`,
      `Lizoca: x=${Math.round(this.girlTwo.x)} y=${Math.round(this.girlTwo.y)}`,
    ]);
  }

  showSeedRewardIfNeeded() {
    if (this.seedReward <= 0) {
      return;
    }

    this.scene.time.delayedCall(360, () => {
      this.playSeedRewardSound();
      this.pulseSeedCounter();
      this.showSeedRewardToast(this.seedReward);
    });
  }

  playSeedRewardSound() {
    const key = ASSET_KEYS.seedRewardSound;
    const audioCache = this.scene.cache.audio;
    const hasRewardSound = Boolean(audioCache?.exists?.(key) || audioCache?.has?.(key));

    if (!hasRewardSound) {
      return;
    }

    if (this.scene.sound.locked) {
      this.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.scene.sound.play(key, { volume: 0.46 });
      });
      return;
    }

    this.scene.sound.play(key, { volume: 0.46 });
  }

  pulseSeedCounter() {
    this.scene.tweens.add({
      targets: this.seedCounter.container,
      scale: 1.08,
      duration: 180,
      ease: 'Sine.easeOut',
      yoyo: true,
    });
  }

  showSeedRewardToast(amount) {
    const rewardLabel = amount === 1 ? 'muda de pau-brasil' : 'mudas de pau-brasil';
    const container = this.scene.add.container(GAME_WIDTH - 170, 164).setDepth(110).setScrollFactor(0).setAlpha(0);
    const background = this.scene.add
      .rectangle(0, 0, 286, 38, 0x143220, 0.74)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0xf2d278, 0.5);
    const icon = this.scene.add.image(-121, 0, ASSET_KEYS.seedIcon).setDisplaySize(28, 28);
    const text = this.scene.add
      .text(-94, 0, `+${amount} ${rewardLabel}`, {
        color: '#fff8cf',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        stroke: '#14321f',
        strokeThickness: 3,
      })
      .setOrigin(0, 0.5);

    container.add([background, icon, text]);

    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      y: 150,
      duration: 220,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(950, () => {
          this.scene.tweens.add({
            targets: container,
            alpha: 0,
            y: 136,
            duration: 320,
            ease: 'Sine.easeIn',
            onComplete: () => container.destroy(),
          });
        });
      },
    });
  }
}
