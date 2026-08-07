import { createGameConfig } from './config.js?v=2026-08-07-route-cache-18';
import BootScene from './scenes/BootScene.js?v=2026-08-07-route-cache-18';
import BromeliadHouseScene from './scenes/BromeliadHouseScene.js?v=2026-08-07-route-cache-18';
import CreditsScene from './scenes/CreditsScene.js?v=2026-08-07-route-cache-18';
import GameScene from './scenes/GameScene.js?v=2026-08-07-route-cache-18';
import GreenhousesScene from './scenes/GreenhousesScene.js?v=2026-08-07-route-cache-18';
import HerbariumScene from './scenes/HerbariumScene.js?v=2026-08-07-route-cache-18';
import LakeScene from './scenes/LakeScene.js?v=2026-08-07-route-cache-18';
import MuseumScene from './scenes/MuseumScene.js?v=2026-08-07-route-cache-18';
import OrchidHouseScene from './scenes/OrchidHouseScene.js?v=2026-08-07-route-cache-18';
import SensoryGardenScene from './scenes/SensoryGardenScene.js?v=2026-08-07-route-cache-18';
import TitleScene from './scenes/TitleScene.js?v=2026-08-07-route-cache-18';
import VisitorCenterScene from './scenes/VisitorCenterScene.js?v=2026-08-07-route-cache-18';

window.addEventListener('load', () => {
  window.irmasLaLiGame = new window.Phaser.Game(
    createGameConfig([
      BootScene,
      TitleScene,
      GameScene,
      VisitorCenterScene,
      MuseumScene,
      HerbariumScene,
      LakeScene,
      OrchidHouseScene,
      BromeliadHouseScene,
      SensoryGardenScene,
      GreenhousesScene,
      CreditsScene,
    ]),
  );
  window.educacaoAmbientalGame = window.irmasLaLiGame;
});
