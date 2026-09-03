import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-01-monkey-guidance-70';

export default class SensoryGardenScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.sensoryGarden, ASSET_KEYS.sensoryGarden, 'Jardim Sensorial');
  }
}
