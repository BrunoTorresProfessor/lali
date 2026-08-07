import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js';

export default class LakeScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.lake, ASSET_KEYS.lake, 'Lago Frei Leandro');
  }
}
