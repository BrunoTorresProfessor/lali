import { ASSET_KEYS, SCENE_KEYS } from '../config.js';
import EnvironmentScene from './EnvironmentScene.js?v=2026-09-10-sea-77';

export default class MuseumScene extends EnvironmentScene {
  constructor() {
    super(SCENE_KEYS.museum, ASSET_KEYS.museum, 'Museu do Jardim Botânico');
  }
}
