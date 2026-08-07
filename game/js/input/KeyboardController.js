import { PLAYER_DIRECTIONS } from '../config.js';

const Phaser = window.Phaser;

export default class KeyboardController {
  constructor(scene, formation) {
    this.scene = scene;
    this.formation = formation;
    this.controlGroups = [
      {
        keys: this.createKeyMap({
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D,
        }),
      },
      {
        keys: this.createKeyMap({
          left: Phaser.Input.Keyboard.KeyCodes.LEFT,
          right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        }),
      },
    ];

    this.captureGameplayKeys();
  }

  createKeyMap(keyCodes) {
    return {
      left: this.scene.input.keyboard.addKey(keyCodes.left),
      right: this.scene.input.keyboard.addKey(keyCodes.right),
    };
  }

  captureGameplayKeys() {
    this.scene.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);
  }

  update() {
    this.updateKeyboardInput();
    this.updateGamepadInput();
  }

  updateKeyboardInput() {
    const input = this.getCombinedInput();

    if (input.horizontal === 0) {
      this.formation.stop();
      return;
    }

    const direction = this.resolveDirection(input.horizontal, this.formation.girlOne.lastDirection);
    const velocityX = input.horizontal * this.formation.girlOne.speed;

    this.formation.move(velocityX, 0, direction);
  }

  getCombinedInput() {
    return this.controlGroups.reduce(
      (combinedInput, controlGroup) => ({
        horizontal: Phaser.Math.Clamp(
          combinedInput.horizontal + this.getAxis(controlGroup.keys.left, controlGroup.keys.right),
          -1,
          1,
        ),
      }),
      { horizontal: 0 },
    );
  }

  getAxis(negativeKey, positiveKey) {
    return Number(positiveKey.isDown) - Number(negativeKey.isDown);
  }

  resolveDirection(horizontal, fallbackDirection) {
    if (horizontal < 0) {
      return PLAYER_DIRECTIONS.left;
    }

    if (horizontal > 0) {
      return PLAYER_DIRECTIONS.right;
    }

    return fallbackDirection;
  }

  updateGamepadInput() {
    // Futuro: adaptar eixo horizontal de gamepads sem alterar as classes das meninas.
  }
}
