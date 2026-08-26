import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-08-26-seed-reward-sound-58';

export default class VisitorCenterScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.visitorCenter, ASSET_KEYS.visitorCenter, 'Centro de Visitantes');
  }
}
