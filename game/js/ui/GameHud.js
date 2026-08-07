import { GAME_WIDTH } from '../config.js';

export default class GameHud {
  constructor(scene, girlOne, girlTwo) {
    this.scene = scene;
    this.girlOne = girlOne;
    this.girlTwo = girlTwo;
    this.titleText = this.createTitleText();
    this.statsText = this.createStatsText();

    this.update();
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

  createStatsText() {
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

  update() {
    const fps = Math.round(this.scene.game.loop.actualFps || 0);

    this.statsText.setText([
      `FPS: ${fps}`,
      `Laurinha: x=${Math.round(this.girlOne.x)} y=${Math.round(this.girlOne.y)}`,
      `Lizoca: x=${Math.round(this.girlTwo.x)} y=${Math.round(this.girlTwo.y)}`,
    ]);
  }
}
