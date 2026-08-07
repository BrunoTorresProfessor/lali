export default class PlayButton {
  constructor(scene, x, y, onClick) {
    this.scene = scene;
    this.onClick = onClick;
    this.container = scene.add.container(x, y).setDepth(20);
    this.background = this.createBackground();
    this.label = this.createLabel();

    this.container.add([this.background, this.label]);
    this.configureInteraction();
  }

  createBackground() {
    return this.scene.add
      .rectangle(0, 0, 260, 74, 0xffc94a, 1)
      .setStrokeStyle(4, 0xffffff, 1);
  }

  createLabel() {
    return this.scene.add
      .text(0, 0, 'INICIAR', {
        align: 'center',
        color: '#4a2d0b',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  configureInteraction() {
    this.background
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.setHoverState(true))
      .on('pointerout', () => this.setHoverState(false))
      .on('pointerdown', () => this.press())
      .on('pointerup', () => this.release());
  }

  setHoverState(isHovering) {
    this.background.setFillStyle(isHovering ? 0xffda65 : 0xffc94a, 1);
    this.container.setScale(isHovering ? 1.04 : 1);
  }

  press() {
    this.container.setScale(0.98);
  }

  release() {
    this.container.setScale(1.04);
    this.onClick();
  }
}
