import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js';

export default class VisitorCenterScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.visitorCenter, ASSET_KEYS.visitorCenter, 'Centro de Visitantes');
  }
}
