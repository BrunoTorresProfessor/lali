import { ASSET_KEYS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config.js';
import PlayButton from '../ui/PlayButton.js';

const Phaser = window.Phaser;

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.title);
  }

  create() {
    this.createBackground();
    this.createReadableOverlay();
    this.createTitleText();
    this.playButton = new PlayButton(this, GAME_WIDTH / 2, GAME_HEIGHT - 104, () => this.startGame());
    this.menuMusic = this.createMenuMusic();

    this.tryStartMenuMusic();
  }

  createBackground() {
    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSET_KEYS.titleBackground)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(0);
  }

  createReadableOverlay() {
    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 126, GAME_WIDTH, 210, 0x12301f, 0.34)
      .setDepth(5);
  }

  createTitleText() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 182, 'Irmãs LaLi no Jardim', {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '46px',
        fontStyle: 'bold',
        stroke: '#1c3a25',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(10);
  }

  tryStartMenuMusic() {
    if (!this.menuMusic) {
      return;
    }

    if (!this.sound.locked) {
      this.startMenuMusic();
      return;
    }

    this.sound.once(Phaser.Sound.Events.UNLOCKED, () => this.startMenuMusic());
    this.input.once('pointerdown', () => this.startMenuMusic());
    this.input.keyboard?.once('keydown', () => this.startMenuMusic());
  }

  startMenuMusic() {
    if (this.menuMusic && !this.menuMusic.isPlaying) {
      this.menuMusic.play();
    }
  }

  createMenuMusic() {
    const audioCache = this.cache.audio;
    const hasMenuMusic = Boolean(audioCache?.exists?.(ASSET_KEYS.menuMusic) || audioCache?.has?.(ASSET_KEYS.menuMusic));

    if (!hasMenuMusic) {
      return null;
    }

    return this.sound.add(ASSET_KEYS.menuMusic, { loop: true, volume: 0.28 });
  }

  startGame() {
    this.startMenuMusic();
    this.cameras.main.fadeOut(280, 14, 35, 22);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.menuMusic?.stop();
      this.scene.start(SCENE_KEYS.game, { resetJourney: true });
    });
  }
}
