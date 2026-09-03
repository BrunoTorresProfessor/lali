import { ASSET_KEYS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config.js?v=2026-09-01-monkey-guidance-70';

const Phaser = window.Phaser;

const CREDIT_LINES = Object.freeze([
  { text: 'Criadores', size: '42px', color: '#ffe18a', gapAfter: 26 },
  { text: 'Bruno Augusto Torres', size: '28px', color: '#ffffff' },
  { text: 'Bruno Coutinho Kurtz', size: '28px', color: '#ffffff' },
  { text: 'Lucas Costa Monteiro Lopes', size: '28px', color: '#ffffff' },
  { text: 'Luis Alexandre Estevão da Silva', size: '28px', color: '#ffffff' },
  { text: 'Luis Felipe Daibes de Andrade', size: '28px', color: '#ffffff' },
  { text: 'Paolo de Castro Martins Massoni', size: '28px', color: '#ffffff' },
  { text: 'Stella Mata de Lara Rocha', size: '28px', color: '#ffffff' },
  { text: 'Vivian Martins Lopes Torres', size: '28px', color: '#ffffff', gapAfter: 42 },
  { text: 'Agradecimentos especiais', size: '28px', color: '#ffe18a', gapAfter: 18 },
  { text: 'Jardim Botânico do Rio de Janeiro', size: '24px', color: '#ffffff', gapAfter: 42 },
  { text: 'Obrigado por Participar', size: '32px', color: '#ffe18a', gapAfter: 20 },
  { text: 'Esperamos que esta aventura tenha despertado seu interesse pela Botânica.', size: '20px', color: '#f8f1d5' },
  { text: 'Visite o Jardim Botânico do Rio de Janeiro e continue cuidando da natureza.', size: '20px', color: '#f8f1d5' },
]);

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.credits);
  }

  create() {
    this.hasFinished = false;
    this.createBackground();
    this.createCredits();
    this.createControls();
    this.playSoftMusic();

    this.cameras.main.fadeIn(600, 8, 18, 24);
  }

  createBackground() {
    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSET_KEYS.creditsBackground)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(0);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x06140f, 0.5).setDepth(2);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x06140f, 0.18).setDepth(3);
  }

  createCredits() {
    this.creditsContainer = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT + 70).setDepth(10);

    let offsetY = 0;
    CREDIT_LINES.forEach((line) => {
      const text = this.add
        .text(0, offsetY, line.text, {
          align: 'center',
          color: line.color ?? '#ffffff',
          fixedWidth: 1040,
          fontFamily: 'Georgia, Times New Roman, serif',
          fontSize: line.size,
          fontStyle: 'bold',
          stroke: '#142217',
          strokeThickness: 4,
          wordWrap: { width: 980, useAdvancedWrap: true },
        })
        .setOrigin(0.5, 0);

      this.creditsContainer.add(text);
      offsetY += text.height + (line.gapAfter ?? 14);
    });

    this.tweens.add({
      targets: this.creditsContainer,
      y: -offsetY - 80,
      duration: 42000,
      ease: 'Linear',
      onComplete: () => this.finishCredits(),
    });
  }

  createControls() {
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 28, 'Clique ou pressione ESPAÇO para voltar ao início', {
        align: 'center',
        color: '#f7ffe8',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '18px',
        stroke: '#14321f',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(20);

    this.input.once('pointerdown', () => this.finishCredits());
    this.input.keyboard?.once('keydown-SPACE', () => this.finishCredits());
  }

  playSoftMusic() {
    const audioCache = this.cache.audio;
    const hasMusic = Boolean(audioCache?.exists?.(ASSET_KEYS.menuMusic) || audioCache?.has?.(ASSET_KEYS.menuMusic));

    if (!hasMusic) {
      return;
    }

    this.creditsMusic = this.sound.add(ASSET_KEYS.menuMusic, { loop: true, volume: 0.18 });
    this.creditsMusic.play();
  }

  finishCredits() {
    if (this.hasFinished) {
      return;
    }

    this.hasFinished = true;
    this.creditsMusic?.stop();
    this.cameras.main.fadeOut(500, 8, 18, 24);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SCENE_KEYS.title);
    });
  }
}
