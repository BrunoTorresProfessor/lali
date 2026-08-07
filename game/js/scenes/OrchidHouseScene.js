import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js';

export default class OrchidHouseScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.orchidHouse, ASSET_KEYS.orchidHouse, 'Orquidário');
  }
}
