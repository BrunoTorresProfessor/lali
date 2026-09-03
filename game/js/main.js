import { createGameConfig } from './config.js?v=2026-09-01-monkey-guidance-70';
import BootScene from './scenes/BootScene.js?v=2026-09-01-monkey-guidance-70';
import BromeliadHouseScene from './scenes/BromeliadHouseScene.js?v=2026-09-01-monkey-guidance-70';
import CarnivorousGreenhouseScene from './scenes/CarnivorousGreenhouseScene.js?v=2026-09-01-monkey-guidance-70';
import ChafarizDasMusasScene from './scenes/ChafarizDasMusasScene.js?v=2026-09-01-monkey-guidance-70';
import CreditsScene from './scenes/CreditsScene.js?v=2026-09-01-monkey-guidance-70';
import GameScene from './scenes/GameScene.js?v=2026-09-01-monkey-guidance-70';
import GreenhousesScene from './scenes/GreenhousesScene.js?v=2026-09-01-monkey-guidance-70';
import HerbariumScene from './scenes/HerbariumScene.js?v=2026-09-01-monkey-guidance-70';
import LakeScene from './scenes/LakeScene.js?v=2026-09-01-monkey-guidance-70';
import MuseumScene from './scenes/MuseumScene.js?v=2026-09-01-monkey-guidance-70';
import NationalSchoolScene from './scenes/NationalSchoolScene.js?v=2026-09-01-monkey-guidance-70';
import OrchidHouseScene from './scenes/OrchidHouseScene.js?v=2026-09-01-monkey-guidance-70';
import SensoryGardenScene from './scenes/SensoryGardenScene.js?v=2026-09-01-monkey-guidance-70';
import SumaumaScene from './scenes/SumaumaScene.js?v=2026-09-01-monkey-guidance-70';
import TitleScene from './scenes/TitleScene.js?v=2026-09-01-monkey-guidance-70';
import VisitorCenterScene from './scenes/VisitorCenterScene.js?v=2026-09-01-monkey-guidance-70';

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
      CarnivorousGreenhouseScene,
      NationalSchoolScene,
      CreditsScene,
    ]),
  );
  window.educacaoAmbientalGame = window.irmasLaLiGame;
});
