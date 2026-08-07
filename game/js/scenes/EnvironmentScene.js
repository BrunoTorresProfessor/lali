import { ENVIRONMENT_VISIT_DURATION, GAME_HEIGHT, GAME_WIDTH } from '../config.js';

const Phaser = window.Phaser;

export default class EnvironmentScene extends Phaser.Scene {
  constructor(sceneKey, backgroundKey, title) {
    super(sceneKey);

    this.backgroundKey = backgroundKey;
    this.title = title;
  }

  create(data = {}) {
    this.returnScene = data.returnScene;
    this.journeyState = data.journeyState;
    this.activeTitle = data.title ?? this.title;
    this.hasReturned = false;

    this.createBackground();
    this.createTitle();
    this.cameras.main.fadeIn(450, 10, 24, 18);

    this.time.delayedCall(ENVIRONMENT_VISIT_DURATION, () => this.returnToTrail());
    this.input.once('pointerdown', () => this.returnToTrail());
    this.input.keyboard?.once('keydown-SPACE', () => this.returnToTrail());
  }

  createBackground() {
    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.backgroundKey)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(0);
  }

  createTitle() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 52, GAME_WIDTH, 104, 0x10271c, 0.42).setDepth(5);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 68, this.activeTitle, {
        align: 'center',
        color: '#ffffff',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        stroke: '#14321f',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(10);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 28, 'Clique ou pressione ESPACO para continuar', {
        align: 'center',
        color: '#f7ffe8',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '18px',
        stroke: '#14321f',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(10);
  }

  returnToTrail() {
    if (this.hasReturned || !this.returnScene) {
      return;
    }

    this.hasReturned = true;
    this.cameras.main.fadeOut(450, 10, 24, 18);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(this.returnScene, { journeyState: this.journeyState });
    });
  }
}
