import { GAME_HEIGHT, GAME_WIDTH } from '../config.js?v=2026-08-09-woodpecker-event-55';

const Phaser = window.Phaser;

export default class SpeechBubble {
  constructor(scene, target, message, options = {}) {
    this.scene = scene;
    this.target = target;
    this.message = message;
    this.duration = options.duration ?? 3600;
    this.speaker = options.speaker ?? '';
    this.container = this.createContainer();

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.scene.time.delayedCall(this.duration, () => this.destroy());
    this.update();
  }

  createContainer() {
    const container = this.scene.add.container(0, 0).setDepth(92).setScrollFactor(1);
    const messageText = this.createMessageText();
    const speakerText = this.createSpeakerText();
    const contentWidth = Math.max(messageText.width, speakerText?.width ?? 0);
    const bubbleWidth = Math.max(360, contentWidth + 42);
    const bubbleHeight = messageText.height + (speakerText ? speakerText.height + 12 : 0) + 34;
    const background = this.createBackground(bubbleWidth, bubbleHeight);

    if (speakerText) {
      speakerText.setPosition(0, -bubbleHeight / 2 + 24);
      messageText.setPosition(0, -bubbleHeight / 2 + speakerText.height + 42);
    } else {
      messageText.setPosition(0, 0);
    }

    container.add([background, speakerText, messageText].filter(Boolean));
    this.bubbleWidth = bubbleWidth;
    this.bubbleHeight = bubbleHeight;

    return container;
  }

  createSpeakerText() {
    if (!this.speaker) {
      return null;
    }

    return this.scene.add
      .text(0, 0, this.speaker, {
        align: 'center',
        color: '#1e6d42',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  createMessageText() {
    return this.scene.add
      .text(0, 0, this.message, {
        align: 'center',
        color: '#203022',
        fixedWidth: 318,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
        lineSpacing: 3,
        wordWrap: { width: 318, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
  }

  createBackground(width, height) {
    const graphic = this.scene.add.graphics();
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    graphic.fillStyle(0xfff8dd, 0.95);
    graphic.lineStyle(4, 0x356b3e, 0.9);
    graphic.fillRoundedRect(-halfWidth, -halfHeight, width, height, 16);
    graphic.strokeRoundedRect(-halfWidth, -halfHeight, width, height, 16);
    graphic.fillTriangle(-34, halfHeight - 2, -10, halfHeight - 2, -26, halfHeight + 24);
    graphic.lineStyle(3, 0x356b3e, 0.9);
    graphic.strokeTriangle(-34, halfHeight - 2, -10, halfHeight - 2, -26, halfHeight + 24);

    return graphic;
  }

  update() {
    if (!this.container?.active || !this.target?.active) {
      return;
    }

    const camera = this.scene.cameras.main;
    const minX = camera.scrollX + this.bubbleWidth / 2 + 24;
    const maxX = camera.scrollX + GAME_WIDTH - this.bubbleWidth / 2 - 24;
    const x = Phaser.Math.Clamp(this.target.x, minX, maxX);
    const y = Phaser.Math.Clamp(
      this.target.y - this.target.displayHeight - this.bubbleHeight / 2 - 24,
      camera.scrollY + this.bubbleHeight / 2 + 18,
      camera.scrollY + GAME_HEIGHT - this.bubbleHeight / 2 - 18,
    );

    this.container.setPosition(x, y);
  }

  destroy() {
    this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.container?.destroy();
    this.container = null;
  }
}
