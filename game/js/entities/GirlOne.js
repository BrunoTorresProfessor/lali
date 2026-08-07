import { PLAYER_CHARACTER_ASSETS } from '../config.js';
import BaseGirl from './BaseGirl.js';

export default class GirlOne extends BaseGirl {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER_CHARACTER_ASSETS.girlOne);

    this.setName('GirlOne');
    this.setDepth(12);
  }
}
