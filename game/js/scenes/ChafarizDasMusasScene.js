import {
  ASSET_KEYS,
  PLAYER_ANIMATION_STATES,
  PLAYER_CHARACTER_ASSETS,
  SCENE_KEYS,
} from '../config.js?v=2026-09-09-cactario-trilha-72';
import PlayerAnimationRegistry from '../animation/PlayerAnimationRegistry.js';
import SpeechBubble from '../ui/SpeechBubble.js?v=2026-09-09-cactario-trilha-72';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-09-cactario-trilha-72';

const MONKEY_GUIDANCE = 'Nunca alimente os macacos.';

export default class ChafarizDasMusasScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.chafarizDasMusas, ASSET_KEYS.chafarizDasMusas, 'Chafariz das Musas', {
      ambientAudio: {
        key: ASSET_KEYS.capuchinMonkeysChatter,
        loop: true,
        volume: 0.17,
      },
    });
  }

  create(data = {}) {
    super.create(data);

    this.createLaurinha();
    this.time.delayedCall(320, () => this.showMonkeyGuidance());
  }

  createLaurinha() {
    const characterConfig = PLAYER_CHARACTER_ASSETS.girlOne;

    PlayerAnimationRegistry.register(this, characterConfig);
    this.laurinha = this.add
      .sprite(670, 522, `${characterConfig.id}-talk`)
      .setScale(characterConfig.displayScale)
      .setDepth(4);
    this.laurinha.play(
      PlayerAnimationRegistry.getKey(characterConfig.id, PLAYER_ANIMATION_STATES.talk),
      true,
    );
  }

  showMonkeyGuidance() {
    if (this.hasReturned || !this.laurinha?.active) {
      return;
    }

    this.monkeyGuidanceBubble = new SpeechBubble(this, this.laurinha, MONKEY_GUIDANCE, {
      duration: 3700,
      speaker: 'Laurinha',
    });
  }
}
