import { FORMATION_GAP, PLAYER_ANIMATION_STATES, PLAYER_DIRECTIONS } from '../config.js';

export default class SideBySideFormation {
  constructor(girlOne, girlTwo) {
    this.girlOne = girlOne;
    this.girlTwo = girlTwo;
    this.gap = FORMATION_GAP;
    this.laneY = (girlOne.y + girlTwo.y) / 2;
    this.facingDirection = PLAYER_DIRECTIONS.right;
    this.worldBounds = girlOne.scene.physics.world.bounds;
    this.keepSideBySide();
  }

  get players() {
    return [this.girlOne, this.girlTwo];
  }

  getCenter() {
    return {
      x: (this.girlOne.x + this.girlTwo.x) / 2,
      y: this.laneY,
    };
  }

  setCenter(x, y = this.laneY, direction = this.facingDirection) {
    this.laneY = y;
    this.facingDirection = direction;
    const center = this.clampCenter({ x, y });

    this.placeAtCenter(center);
    this.playIdle(direction);
  }

  move(velocityX, velocityY, direction) {
    if (direction === PLAYER_DIRECTIONS.left || direction === PLAYER_DIRECTIONS.right) {
      this.facingDirection = direction;
    }

    this.players.forEach((player) => player.move(velocityX, velocityY, direction));
    this.keepSideBySide();
  }

  stop() {
    this.players.forEach((player) => player.stop());
    this.keepSideBySide();
  }

  isMoving() {
    return this.players.some((player) => Math.abs(player.body?.velocity?.x ?? 0) > 1);
  }

  keepSideBySide() {
    // Mantem as protagonistas juntas no percurso horizontal.
    // Futuro: trocar esta regra por formacoes diferentes em puzzles ou cenas.
    const center = this.clampCenter({
      x: (this.girlOne.x + this.girlTwo.x) / 2,
      y: this.laneY,
    });

    this.placeAtCenter(center);
  }

  placeAtCenter(center) {
    const olderLeadOffset = this.facingDirection === PLAYER_DIRECTIONS.left ? -this.gap / 2 : this.gap / 2;

    this.girlOne.setPosition(center.x + olderLeadOffset, center.y);
    this.girlTwo.setPosition(center.x - olderLeadOffset, center.y);
  }

  clampCenter(center) {
    const halfGap = this.gap / 2;
    const halfWidth = Math.max(this.girlOne.displayWidth, this.girlTwo.displayWidth) / 2;
    const halfHeight = Math.max(this.girlOne.displayHeight, this.girlTwo.displayHeight) / 2;

    return {
      x: this.clamp(center.x, this.worldBounds.x + halfGap + halfWidth, this.worldBounds.width - halfGap - halfWidth),
      y: this.clamp(this.laneY, this.worldBounds.y + halfHeight, this.worldBounds.height - halfHeight),
    };
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  playIdle(direction) {
    this.players.forEach((player) => {
      player.lastDirection = direction;
      player.playDirectionalAnimation(PLAYER_ANIMATION_STATES.idle, direction);
    });
  }
}
