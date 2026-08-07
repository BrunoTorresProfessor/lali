import { PLAYER_ANIMATION_STATES, PLAYER_DIRECTIONS, PLAYER_SPEED } from '../config.js';
import PlayerAnimationRegistry from '../animation/PlayerAnimationRegistry.js';

const Phaser = window.Phaser;

export default class BaseGirl extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, characterConfig) {
    super(scene, x, y, `${characterConfig.id}-idle`);

    this.speed = PLAYER_SPEED;
    this.characterConfig = characterConfig;
    this.lastDirection = PLAYER_DIRECTIONS.right;
    this.currentState = PLAYER_ANIMATION_STATES.idle;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    PlayerAnimationRegistry.register(scene, characterConfig);
    this.configurePhysicsBody();
    this.playDirectionalAnimation(PLAYER_ANIMATION_STATES.idle, this.lastDirection);
  }

  configurePhysicsBody() {
    const body = this.characterConfig.body;

    this.setScale(this.characterConfig.displayScale ?? 1);
    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.setMaxVelocity(this.speed, this.speed);
    this.body.setSize(body.width, body.height);
    this.body.setOffset(body.offsetX, body.offsetY);
  }

  move(velocityX, velocityY, direction) {
    this.setVelocity(velocityX, velocityY);

    if (direction) {
      this.lastDirection = direction;
    }

    this.playDirectionalAnimation(PLAYER_ANIMATION_STATES.walk, this.lastDirection);
  }

  stop() {
    this.setVelocity(0, 0);
    this.playDirectionalAnimation(PLAYER_ANIMATION_STATES.idle, this.lastDirection);
  }

  playDirectionalAnimation(state, direction) {
    this.updateHorizontalFacing(direction);

    const safeState = this.characterConfig ? state : PLAYER_ANIMATION_STATES.idle;
    const key = PlayerAnimationRegistry.getKey(this.characterConfig.id, safeState);

    if (this.anims.currentAnim?.key === key) {
      return;
    }

    this.currentState = safeState;
    this.play(key, true);
  }

  playState(state, direction = this.lastDirection) {
    this.playDirectionalAnimation(state, direction);
  }

  updateHorizontalFacing(direction) {
    if (direction === PLAYER_DIRECTIONS.left) {
      this.setFlipX(true);
      return;
    }

    if (direction === PLAYER_DIRECTIONS.right) {
      this.setFlipX(false);
    }
  }
}
