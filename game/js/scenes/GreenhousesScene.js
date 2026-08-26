import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-08-26-seed-reward-sound-58';

export default class GreenhousesScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.greenhouses, ASSET_KEYS.greenhouses, 'Estufas');
  }
}
