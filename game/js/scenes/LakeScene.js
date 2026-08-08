import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-08-08-fish-cache-33';
import EnvironmentScene from './EnvironmentScene.js';

export default class LakeScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.lake, ASSET_KEYS.lake, 'Lago das Vitórias-Régias', {
      ambientAudio: {
        key: ASSET_KEYS.stoneWaterSplash,
        loop: false,
        volume: 0.24,
        delay: 0.35,
      },
    });
  }
}
