import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-01-monkey-guidance-70';

export default class HerbariumScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.herbarium, ASSET_KEYS.herbarium, 'Herbário RB');
  }
}
