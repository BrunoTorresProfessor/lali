import { PLAYER_CHARACTER_ASSETS } from '../config.js';
import BaseGirl from './BaseGirl.js';

export default class GirlTwo extends BaseGirl {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER_CHARACTER_ASSETS.girlTwo);

    this.setName('GirlTwo');
    this.setDepth(11);
  }
}
