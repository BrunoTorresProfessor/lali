import { ASSET_KEYS, GAME_HEIGHT, GAME_WIDTH, PLAYER_CHARACTER_ASSETS, SCENE_KEYS } from '../config.js?v=2026-09-09-cactario-trilha-72';
import PlayerAnimationRegistry from '../animation/PlayerAnimationRegistry.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-09-cactario-trilha-72';

const Phaser = window.Phaser;

// Narration split into five illustrated pages, with the requested capitalization.
export const CACTUS_DIALOGUE = Object.freeze([
  { background: ASSET_KEYS.cactusGarden, text: 'Olá, você está no cactário do jardim botânico do Rio de Janeiro!' },
  { background: ASSET_KEYS.cactusOverview, text: 'Aqui moram muitos cactos e outras plantas suculentas,' },
  { background: ASSET_KEYS.cactusGreenhouses, text: 'Cada uma com um jeitinho especial de viver.' },
  { background: ASSET_KEYS.cactusGiants, text: 'Tem planta com espinho, pequenininha e grandona…' },
  { background: ASSET_KEYS.cactusSucculents, text: 'E a maioria delas acumula água em seus tecidos para sobreviver aos períodos de seca nos seus locais de origem' },
]);

export default class CactusGardenScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.cactusGarden, ASSET_KEYS.cactusGarden, 'Cactário');
  }

  create(data = {}) {
    this.returnScene = data.returnScene ?? SCENE_KEYS.game;
    this.journeyState = data.journeyState;
    this.hasReturned = false;
    this.pageIndex = 0;
    this.ready = false;
    this.isChangingPage = false;

    this.background = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.backgroundKey).setDepth(0);
    this.fitBackground(this.background);
    this.createWelcome();
    this.createCharacters();
    this.createDialogue();
    this.createPhaseMap();
    this.cameras.main.fadeIn(450, 10, 24, 18);

    this.handleDialogueKey = (event) => {
      if (event.repeat) return;
      if (['Space', 'Enter', 'ArrowRight', 'ArrowLeft'].includes(event.code)) event.preventDefault();
      if (['Space', 'Enter', 'ArrowRight'].includes(event.code)) this.advanceDialogue();
      if (event.code === 'ArrowLeft') this.previousPage();
    };
    this.input.keyboard?.on('keydown', this.handleDialogueKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off('keydown', this.handleDialogueKey);
      this.stopSpeaking();
    });
    this.walkIn();
  }

  fitBackground(background) {
    const source = background.texture.getSourceImage();
    background.setScale(Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height));
  }

  createWelcome() {
    this.add.rectangle(640, 45, 1280, 90, 0x10271c, 0.78).setDepth(5);
    this.add.text(640, 13, 'Cactário', {
      fontFamily: 'Georgia, serif', fontSize: '34px', color: '#ffdf89', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setDepth(6);
    this.add.text(640, 56, 'Bem-vindas, Laurinha e Lizoca!', {
      fontFamily: 'Arial, sans-serif', fontSize: '19px', color: '#ffffff',
    }).setOrigin(0.5, 0).setDepth(6);
  }

  createCharacters() {
    this.add.ellipse(555, 633, 90, 16, 0x132b1c, 0.25).setDepth(2);
    this.thiago = this.add.image(555, 640, ASSET_KEYS.thiago).setOrigin(0.5, 1).setDepth(4);
    this.thiago.setScale(230 / this.thiago.height);
    this.maskThiago();
    // Mouth coordinates are relative to the existing 1024 x 1536 character art.
    this.mouth = this.add.graphics()
      .setPosition(
        this.thiago.x + (533 - this.thiago.width / 2) * this.thiago.scaleX,
        this.thiago.y + (219 - this.thiago.height) * this.thiago.scaleY,
      )
      .setScale(this.thiago.scaleX).setRotation(-0.16).setDepth(5).setVisible(false);
    this.add.text(565, 647, 'Thiago', {
      fontFamily: 'Arial, sans-serif', fontSize: '17px', fontStyle: 'bold',
      color: '#fff7d4', stroke: '#173724', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(6);

    this.characterEntries = [PLAYER_CHARACTER_ASSETS.girlOne, PLAYER_CHARACTER_ASSETS.girlTwo].map((config, index) => {
      PlayerAnimationRegistry.register(this, config);
      const sprite = this.add.sprite(-40 - index * 100, 574, `${config.id}-walk`)
        .setScale(config.displayScale).setDepth(4);
      return { sprite, config, destination: 380 - index * 100 };
    });
  }

  walkIn() {
    this.characterEntries.forEach(({ sprite, config, destination }, index) => {
      sprite.play(PlayerAnimationRegistry.getKey(config.id, 'walk'));
      this.tweens.add({
        targets: sprite, x: destination, duration: 2200, ease: 'Linear',
        onComplete: () => {
          sprite.play(PlayerAnimationRegistry.getKey(config.id, 'look'));
          if (index === this.characterEntries.length - 1 && !this.hasReturned) {
            this.ready = true;
            this.dialogueContainer.setVisible(true);
            this.updatePage();
          }
        },
      });
    });
  }

  maskThiago() {
    // ImageGen supplied an RGB image with a checkerboard. Clip its silhouette
    // with a native Phaser mask; keep the generated source artwork intact.
    const outline = [
      [543, 25], [508, 29], [481, 44], [464, 65], [454, 89], [451, 122],
      [457, 162], [461, 203], [467, 239], [482, 275], [492, 292],
      [483, 303], [456, 313], [447, 327], [438, 345], [421, 366],
      [394, 392], [375, 429], [348, 476], [317, 505], [268, 520],
      [214, 501], [178, 480], [158, 464], [148, 464], [145, 474],
      [155, 490], [170, 505], [159, 515], [138, 519], [109, 517],
      [91, 516], [81, 521], [83, 530], [96, 542], [107, 558],
      [130, 572], [166, 582], [218, 587], [231, 606], [257, 629],
      [289, 643], [324, 647], [357, 642], [390, 627], [416, 606],
      [418, 649], [409, 698], [407, 748], [416, 790], [423, 818],
      [425, 866], [433, 929], [451, 1004], [471, 1067], [486, 1135],
      [496, 1201], [501, 1253], [515, 1285], [517, 1321],
      [503, 1344], [474, 1369], [449, 1384], [425, 1400], [416, 1419],
      [415, 1444], [430, 1460], [465, 1468], [503, 1465], [547, 1453],
      [590, 1442], [629, 1430], [647, 1418], [656, 1392], [659, 1359],
      [650, 1320], [647, 1289], [654, 1247], [650, 1200], [632, 1129],
      [626, 1090], [617, 1041], [611, 1001], [607, 957], [615, 947],
      [632, 981], [647, 1020], [656, 1086], [669, 1132], [696, 1200],
      [717, 1265], [734, 1309], [758, 1345], [772, 1365],
      [770, 1398], [767, 1433], [780, 1470], [794, 1499], [810, 1515],
      [846, 1524], [886, 1523], [918, 1516], [925, 1500], [918, 1465],
      [902, 1438], [881, 1402], [863, 1375], [845, 1355], [833, 1325],
      [834, 1298], [842, 1268], [842, 1230], [832, 1198], [818, 1160],
      [812, 1118], [809, 1064], [796, 1015], [785, 966], [779, 912],
      [766, 865], [756, 835], [758, 797], [767, 772], [782, 748],
      [826, 728], [850, 699], [866, 667], [881, 632], [889, 604],
      [887, 575], [877, 554], [871, 520], [858, 476], [844, 426],
      [827, 391], [806, 367], [779, 349], [748, 329], [751, 304],
      [737, 278], [707, 257], [680, 247], [667, 215], [660, 178],
      [658, 145], [649, 131], [636, 134], [635, 109], [628, 80],
      [611, 57], [587, 40], [565, 29],
    ];
    const left = this.thiago.x - this.thiago.displayWidth / 2;
    const top = this.thiago.y - this.thiago.displayHeight;
    const points = outline.map(([x, y]) => ({ x: left + x * this.thiago.scaleX, y: top + y * this.thiago.scaleY }));
    const shape = this.make.graphics({ x: 0, y: 0, add: false });
    shape.fillStyle(0xffffff).fillPoints(points, true);
    const mask = shape.createGeometryMask();
    this.thiago.setMask(mask);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.thiago.clearMask();
      mask.destroy();
      shape.destroy();
    });
  }

  createDialogue() {
    this.dialogueWidth = 600;
    this.dialogueContainer = this.add.container(650, 0).setDepth(10).setVisible(false);
    this.dialogueCard = this.add.graphics();
    const speaker = this.add.text(16, 11, 'THIAGO', {
      fontFamily: 'Arial, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#ffdf89',
    });
    this.dialogueText = this.add.text(16, 35, '', {
      fontFamily: 'Arial, sans-serif', fontSize: '22px', color: '#ffffff',
      lineSpacing: 4, wordWrap: { width: this.dialogueWidth - 32, useAdvancedWrap: true },
    });
    this.pageLabel = this.add.text(this.dialogueWidth - 16, 11, '', {
      fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#e1d8b9',
    }).setOrigin(1, 0);
    const hint = this.add.text(300, 12, 'ESPAÇO / ENTER • ← reler', {
      fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#dddcc5',
    }).setOrigin(0.5, 0);
    this.backButton = this.makeButton(16, 0, 108, '← Voltar', () => this.previousPage());
    this.nextButton = this.makeButton(314, 0, 270, 'Continuar →', () => this.advanceDialogue());
    this.dialogueContainer.add([this.dialogueCard, speaker, hint, this.dialogueText, this.pageLabel, this.backButton, this.nextButton]);
  }

  makeButton(x, y, width, label, onClick) {
    const button = this.add.container(x, y);
    const background = this.add.rectangle(0, 0, width, 34, 0x345a38)
      .setOrigin(0).setStrokeStyle(1, 0xdcc581, 0.7).setInteractive({ useHandCursor: true });
    const text = this.add.text(width / 2, 17, label, {
      fontFamily: 'Arial, sans-serif', fontSize: '17px', fontStyle: 'bold', color: '#fff4c8',
    }).setOrigin(0.5);
    background.on('pointerover', () => background.setFillStyle(0x477343));
    background.on('pointerout', () => background.setFillStyle(0x345a38));
    background.on('pointerdown', (pointer, localX, localY, event) => {
      event.stopPropagation();
      onClick();
    });
    button.add([background, text]);
    button.label = text;
    return button;
  }

  updatePage() {
    this.dialogueText.setText(CACTUS_DIALOGUE[this.pageIndex].text);
    this.pageLabel.setText(`${this.pageIndex + 1} / ${CACTUS_DIALOGUE.length}`);
    this.backButton.setVisible(this.pageIndex > 0);
    this.nextButton.label.setText(this.pageIndex === CACTUS_DIALOGUE.length - 1 ? 'Continuar a aventura →' : 'Continuar →');
    const controlsY = this.dialogueText.y + this.dialogueText.height + 10;
    this.backButton.setY(controlsY);
    this.nextButton.setY(controlsY);
    this.dialogueHeight = controlsY + 46;
    this.dialogueContainer.setY(648 - this.dialogueHeight);
    this.dialogueCard.clear().fillStyle(0x102b20, 0.93);
    this.dialogueCard.fillRoundedRect(0, 0, this.dialogueWidth, this.dialogueHeight, 12);
    this.dialogueCard.lineStyle(1.5, 0xe2c982, 0.9);
    this.dialogueCard.strokeRoundedRect(0, 0, this.dialogueWidth, this.dialogueHeight, 12);
    this.startSpeaking(CACTUS_DIALOGUE[this.pageIndex].text);
  }

  startSpeaking(text) {
    this.stopSpeaking();
    this.isSpeaking = true;
    this.mouth.setVisible(true);
    this.speechTween = this.tweens.addCounter({
      from: 0, to: Math.PI * 2, duration: 340, repeat: -1,
      onUpdate: (tween) => {
        const opening = (Math.sin(tween.getValue()) + 1) / 2;
        this.mouthOpening = opening;
        this.mouth.clear();
        // Closed beats reveal the original lips; open beats stay inside the beard.
        if (opening < 0.18) return;
        this.mouth.fillStyle(0xa95d48).fillEllipse(0, 0, 52, 6 + opening * 22);
        this.mouth.fillStyle(0x341b1a).fillEllipse(0, -1, 44, 3 + opening * 18);
        if (opening > 0.55) {
          this.mouth.fillStyle(0xe5d8bd).fillEllipse(0, -5, 28, 4);
          this.mouth.fillStyle(0xbd7363).fillEllipse(1, 5, 22, 5);
        }
      },
    });
    // There is no voice track: animate for the estimated reading time, then
    // return to the original mouth while the player decides when to continue.
    this.speechTimer = this.time.delayedCall(Math.max(2400, text.length * 55), () => this.stopSpeaking());
  }

  stopSpeaking() {
    this.speechTween?.stop();
    this.speechTween = null;
    this.speechTimer?.remove(false);
    this.speechTimer = null;
    this.isSpeaking = false;
    this.mouthOpening = 0;
    if (this.mouth?.active) this.mouth.clear().setVisible(false);
  }

  returnToTrail() {
    this.stopSpeaking();
    super.returnToTrail();
  }

  jumpToPhase(phase) {
    this.stopSpeaking();
    super.jumpToPhase(phase);
  }

  changePage(index) {
    if (!this.ready || this.isChangingPage || this.hasReturned) return;
    this.pageIndex = index;
    this.isChangingPage = true;
    const previous = this.background;
    this.background = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, CACTUS_DIALOGUE[index].background)
      .setDepth(1).setAlpha(0);
    this.fitBackground(this.background);
    this.updatePage();
    this.tweens.add({
      targets: this.background, alpha: 1, duration: 300,
      onComplete: () => {
        previous.destroy();
        this.background.setDepth(0);
        this.isChangingPage = false;
      },
    });
  }

  previousPage() {
    if (this.pageIndex > 0) this.changePage(this.pageIndex - 1);
  }

  advanceDialogue() {
    if (!this.ready || this.isChangingPage || this.hasReturned) return;
    if (this.pageIndex < CACTUS_DIALOGUE.length - 1) {
      this.changePage(this.pageIndex + 1);
    } else {
      this.returnToTrail();
    }
  }
}
