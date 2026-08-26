import { createGameConfig } from './config.js?v=2026-08-26-seed-reward-sound-58';
import BootScene from './scenes/BootScene.js?v=2026-08-26-seed-reward-sound-58';
import BromeliadHouseScene from './scenes/BromeliadHouseScene.js?v=2026-08-26-seed-reward-sound-58';
import ChafarizDasMusasScene from './scenes/ChafarizDasMusasScene.js?v=2026-08-26-seed-reward-sound-58';
import CreditsScene from './scenes/CreditsScene.js?v=2026-08-26-seed-reward-sound-58';
import GameScene from './scenes/GameScene.js?v=2026-08-26-seed-reward-sound-58';
import GreenhousesScene from './scenes/GreenhousesScene.js?v=2026-08-26-seed-reward-sound-58';
import HerbariumScene from './scenes/HerbariumScene.js?v=2026-08-26-seed-reward-sound-58';
import LakeScene from './scenes/LakeScene.js?v=2026-08-26-seed-reward-sound-58';
import MuseumScene from './scenes/MuseumScene.js?v=2026-08-26-seed-reward-sound-58';
import NationalSchoolScene from './scenes/NationalSchoolScene.js?v=2026-08-26-seed-reward-sound-58';
import OrchidHouseScene from './scenes/OrchidHouseScene.js?v=2026-08-26-seed-reward-sound-58';
import SensoryGardenScene from './scenes/SensoryGardenScene.js?v=2026-08-26-seed-reward-sound-58';
import SumaumaScene from './scenes/SumaumaScene.js?v=2026-08-26-seed-reward-sound-58';
import TitleScene from './scenes/TitleScene.js?v=2026-08-26-seed-reward-sound-58';
import VisitorCenterScene from './scenes/VisitorCenterScene.js?v=2026-08-26-seed-reward-sound-58';

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
      NationalSchoolScene,
      CreditsScene,
    ]),
  );
  window.educacaoAmbientalGame = window.irmasLaLiGame;
});
