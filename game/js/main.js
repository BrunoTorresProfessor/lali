import { createGameConfig } from './config.js?v=2026-08-08-fish-cache-33';
import BootScene from './scenes/BootScene.js?v=2026-08-08-fish-cache-33';
import BromeliadHouseScene from './scenes/BromeliadHouseScene.js?v=2026-08-08-fish-cache-33';
import ChafarizDasMusasScene from './scenes/ChafarizDasMusasScene.js?v=2026-08-08-fish-cache-33';
import CreditsScene from './scenes/CreditsScene.js?v=2026-08-08-fish-cache-33';
import GameScene from './scenes/GameScene.js?v=2026-08-08-fish-cache-33';
import GreenhousesScene from './scenes/GreenhousesScene.js?v=2026-08-08-fish-cache-33';
import HerbariumScene from './scenes/HerbariumScene.js?v=2026-08-08-fish-cache-33';
import LakeScene from './scenes/LakeScene.js?v=2026-08-08-fish-cache-33';
import MuseumScene from './scenes/MuseumScene.js?v=2026-08-08-fish-cache-33';
import OrchidHouseScene from './scenes/OrchidHouseScene.js?v=2026-08-08-fish-cache-33';
import SensoryGardenScene from './scenes/SensoryGardenScene.js?v=2026-08-08-fish-cache-33';
import SumaumaScene from './scenes/SumaumaScene.js?v=2026-08-08-fish-cache-33';
import TitleScene from './scenes/TitleScene.js?v=2026-08-08-fish-cache-33';
import VisitorCenterScene from './scenes/VisitorCenterScene.js?v=2026-08-08-fish-cache-33';

window.addEventListener('load', () => {
  window.irmasLaLiGame = new window.Phaser.Game(
    createGameConfig([
      BootScene,
      TitleScene,
      GameScene,
      VisitorCenterScene,
      SumaumaScene,
      ChafarizDasMusasScene,
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
