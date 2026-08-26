import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-08-26-seed-reward-sound-58';
import EnvironmentScene from './EnvironmentScene.js?v=2026-08-26-seed-reward-sound-58';

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
}
