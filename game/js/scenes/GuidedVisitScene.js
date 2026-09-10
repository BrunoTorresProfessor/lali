import { GAME_HEIGHT, GAME_WIDTH, PLAYER_CHARACTER_ASSETS, SCENE_KEYS } from '../config.js?v=2026-09-10-sea-77';
import PlayerAnimationRegistry from '../animation/PlayerAnimationRegistry.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-10-sea-77';

const Phaser = window.Phaser;

export default class GuidedVisitScene extends EnvironmentScene {
  constructor(sceneKey, backgroundKey, title, speakerName, dialogue) {
    super(sceneKey, backgroundKey, title);
    this.speakerName = speakerName;
    this.dialogue = dialogue;
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
    this.add.text(640, 13, this.title, {
      fontFamily: 'Georgia, serif', fontSize: '34px', color: '#ffdf89', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setDepth(6);
    this.add.text(640, 56, 'Bem-vindas, Laurinha e Lizoca!', {
      fontFamily: 'Arial, sans-serif', fontSize: '19px', color: '#ffffff',
    }).setOrigin(0.5, 0).setDepth(6);
  }

  createCharacters() {
    this.createGuide();
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

  createDialogue() {
    this.dialogueWidth = 600;
    this.dialogueContainer = this.add.container(650, 0).setDepth(10).setVisible(false);
    this.dialogueCard = this.add.graphics();
    const speaker = this.add.text(16, 11, this.speakerName.toLocaleUpperCase('pt-BR'), {
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
    this.dialogueText.setText(this.dialogue[this.pageIndex].text);
    this.pageLabel.setText(`${this.pageIndex + 1} / ${this.dialogue.length}`);
    this.backButton.setVisible(this.pageIndex > 0);
    this.nextButton.label.setText(this.pageIndex === this.dialogue.length - 1 ? 'Continuar a aventura →' : 'Continuar →');
    const controlsY = this.dialogueText.y + this.dialogueText.height + 10;
    this.backButton.setY(controlsY);
    this.nextButton.setY(controlsY);
    this.dialogueHeight = controlsY + 46;
    this.dialogueContainer.setY(648 - this.dialogueHeight);
    this.dialogueCard.clear().fillStyle(0x102b20, 0.93);
    this.dialogueCard.fillRoundedRect(0, 0, this.dialogueWidth, this.dialogueHeight, 12);
    this.dialogueCard.lineStyle(1.5, 0xe2c982, 0.9);
    this.dialogueCard.strokeRoundedRect(0, 0, this.dialogueWidth, this.dialogueHeight, 12);
    this.startSpeaking(this.dialogue[this.pageIndex].text);
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
    this.background = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.dialogue[index].background)
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
    if (this.pageIndex < this.dialogue.length - 1) {
      this.changePage(this.pageIndex + 1);
    } else {
      this.returnToTrail();
    }
  }
}
