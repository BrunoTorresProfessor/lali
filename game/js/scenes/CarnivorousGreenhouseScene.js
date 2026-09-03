import {
  ASSET_KEYS,
  FOOTSTEP_AUDIO,
  GAME_WIDTH,
  PLAYER_ANIMATION_STATES,
  PLAYER_CHARACTER_ASSETS,
  SCENE_KEYS,
} from '../config.js?v=2026-09-01-monkey-guidance-70';
import PlayerAnimationRegistry from '../animation/PlayerAnimationRegistry.js';
import CarnivorousPlantEvent from '../systems/CarnivorousPlantEvent.js?v=2026-09-01-monkey-guidance-70';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-01-monkey-guidance-70';

const Phaser = window.Phaser;

export default class CarnivorousGreenhouseScene extends EnvironmentScene {
  constructor() {
    super(
      SCENE_KEYS.carnivorousGreenhouse,
      ASSET_KEYS.carnivorousGreenhouse,
      'Estufa das Plantas Carnívoras',
      { instruction: 'Observe como a dioneia captura seu alimento' },
    );
  }

  create(data = {}) {
    this.returnScene = data.returnScene;
    this.journeyState = data.journeyState;
    this.activeTitle = data.title ?? this.title;
    this.hasReturned = false;
    this.sequenceComplete = false;

    this.createBackground();
    this.createCharacters();
    this.createTitle();
    this.createPhaseMap();
    this.playAmbientAudio();
    this.cameras.main.fadeIn(450, 10, 24, 18);

    const rewardAmount = Number.isFinite(data.entryRewardAmount) ? data.entryRewardAmount : 0;

    if (rewardAmount > 0) {
      this.time.delayedCall(360, () => this.showPreviousPhaseReward(rewardAmount));
    }

    this.plantEvent = new CarnivorousPlantEvent(this, {
      onSnap: () => this.reactToSnap(),
      onComplete: () => this.walkOut(),
    });
    this.plantEvent.play();
    this.walkIn();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopFootsteps());
  }

  createCharacters() {
    const olderConfig = PLAYER_CHARACTER_ASSETS.girlOne;
    const youngerConfig = PLAYER_CHARACTER_ASSETS.girlTwo;

    PlayerAnimationRegistry.register(this, olderConfig);
    PlayerAnimationRegistry.register(this, youngerConfig);

    this.laurinha = this.add
      .sprite(-20, 535, `${olderConfig.id}-walk`)
      .setScale(olderConfig.displayScale)
      .setDepth(4);
    this.lizoca = this.add
      .sprite(-110, 535, `${youngerConfig.id}-walk`)
      .setScale(youngerConfig.displayScale)
      .setDepth(4);

    this.characterEntries = [
      { sprite: this.laurinha, config: olderConfig },
      { sprite: this.lizoca, config: youngerConfig },
    ];
  }

  walkIn() {
    this.playCharacterState(PLAYER_ANIMATION_STATES.walk);
    this.startFootsteps();

    this.tweens.add({
      targets: this.laurinha,
      x: 560,
      duration: 3600,
      ease: 'Linear',
    });
    this.tweens.add({
      targets: this.lizoca,
      x: 470,
      duration: 3600,
      ease: 'Linear',
      onComplete: () => {
        this.stopFootsteps();
        this.playCharacterState(PLAYER_ANIMATION_STATES.look);
      },
    });
  }

  reactToSnap() {
    this.playCharacterState(PLAYER_ANIMATION_STATES.surprised);
  }

  walkOut() {
    this.playCharacterState(PLAYER_ANIMATION_STATES.walk);
    this.startFootsteps();

    this.tweens.add({
      targets: this.laurinha,
      x: 1390,
      duration: 2800,
      ease: 'Linear',
    });
    this.tweens.add({
      targets: this.lizoca,
      x: 1300,
      duration: 2800,
      ease: 'Linear',
      onComplete: () => {
        this.stopFootsteps();
        this.sequenceComplete = true;
        this.time.delayedCall(350, () => this.returnToTrail());
      },
    });
  }

  playCharacterState(state) {
    this.characterEntries.forEach(({ sprite, config }) => {
      sprite.play(PlayerAnimationRegistry.getKey(config.id, state), true);
    });
  }

  startFootsteps() {
    this.stopFootsteps();
    const footstepKeys = [ASSET_KEYS.footstepSoftA, ASSET_KEYS.footstepSoftB].filter((key) => {
      const audioCache = this.cache.audio;
      return Boolean(audioCache?.exists?.(key) || audioCache?.has?.(key));
    });

    if (!footstepKeys.length) {
      return;
    }

    let stepIndex = 0;
    this.footstepTimer = this.time.addEvent({
      delay: FOOTSTEP_AUDIO.intervalMs,
      loop: true,
      callback: () => {
        if (!this.sound.locked) {
          const key = footstepKeys[stepIndex % footstepKeys.length];
          const rate = 1 + Phaser.Math.FloatBetween(-FOOTSTEP_AUDIO.rateVariation, FOOTSTEP_AUDIO.rateVariation);
          this.sound.play(key, { rate, volume: FOOTSTEP_AUDIO.volume });
          stepIndex += 1;
        }
      },
    });
  }

  stopFootsteps() {
    this.footstepTimer?.remove(false);
    this.footstepTimer = null;
  }

  returnToTrail() {
    if (!this.sequenceComplete) {
      return;
    }

    super.returnToTrail();
  }

  showPreviousPhaseReward(amount) {
    this.playRewardSound();

    const rewardLabel = amount === 1 ? 'muda de pau-brasil' : 'mudas de pau-brasil';
    const container = this.add.container(GAME_WIDTH - 170, 150).setDepth(110).setAlpha(0);
    const background = this.add
      .rectangle(0, 0, 286, 38, 0x143220, 0.8)
      .setStrokeStyle(2, 0xf2d278, 0.55);
    const icon = this.add.image(-121, 0, ASSET_KEYS.seedIcon).setDisplaySize(28, 28);
    const text = this.add
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

    this.tweens.add({
      targets: container,
      alpha: 1,
      y: 136,
      duration: 220,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.time.delayedCall(950, () => {
          this.tweens.add({
            targets: container,
            alpha: 0,
            y: 122,
            duration: 320,
            ease: 'Sine.easeIn',
            onComplete: () => container.destroy(),
          });
        });
      },
    });
  }

  playRewardSound() {
    const audioCache = this.cache.audio;
    const hasRewardSound = Boolean(
      audioCache?.exists?.(ASSET_KEYS.seedRewardSound) || audioCache?.has?.(ASSET_KEYS.seedRewardSound),
    );

    if (!hasRewardSound) {
      return;
    }

    if (this.sound.locked) {
      this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.sound.play(ASSET_KEYS.seedRewardSound, { volume: 0.46 });
      });
      return;
    }

    this.sound.play(ASSET_KEYS.seedRewardSound, { volume: 0.46 });
  }
}
