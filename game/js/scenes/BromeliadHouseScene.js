import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-09-cactario-trilha-72';

export default class BromeliadHouseScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.bromeliadHouse, ASSET_KEYS.bromeliadHouse, 'Bromeliário');
  }
}
