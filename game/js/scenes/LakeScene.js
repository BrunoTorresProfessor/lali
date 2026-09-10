import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-09-10-sea-77';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-10-sea-77';

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
