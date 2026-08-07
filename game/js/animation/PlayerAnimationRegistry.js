import {
  PLAYER_ANIMATION_DEFINITIONS,
  PLAYER_ANIMATION_STATES,
} from '../config.js';

export default class PlayerAnimationRegistry {
  static register(scene, characterConfig) {
    // O registrador isola as animacoes do Phaser para permitir novos estados
    // sem alterar Scene, input ou subclasses das protagonistas.
    Object.values(PLAYER_ANIMATION_STATES).forEach((state) => {
      this.createAnimation(scene, characterConfig, state);
    });
  }

  static getKey(characterId, state) {
    return `${characterId}-${state}`;
  }

  static createAnimation(scene, characterConfig, state) {
    const animationConfig = PLAYER_ANIMATION_DEFINITIONS[state];
    const key = this.getKey(characterConfig.id, state);

    if (!animationConfig || scene.anims.exists(key)) {
      return;
    }

    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers(this.getTextureKey(characterConfig, animationConfig), {
        start: 0,
        end: animationConfig.frames - 1,
      }),
      frameRate: animationConfig.frameRate,
      repeat: animationConfig.repeat,
    });
  }

  static getTextureKey(characterConfig, animationConfig) {
    return `${characterConfig.id}-${animationConfig.fileName}`;
  }
}
