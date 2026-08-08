import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js';

export default class SumaumaScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.sumauma, ASSET_KEYS.sumauma, 'Sumaúma');
  }
}
