import { PLAYER_DIRECTIONS, PLAYER_STARTS, SCENE_KEYS } from '../config.js?v=2026-08-09-woodpecker-event-55';
import GirlOne from '../entities/GirlOne.js';
import GirlTwo from '../entities/GirlTwo.js';
import KeyboardController from '../input/KeyboardController.js';
import CameraFollowPoint from '../systems/CameraFollowPoint.js';
import EnvironmentalEventManager from '../systems/EnvironmentalEventManager.js?v=2026-08-09-woodpecker-event-55';
import FootstepSoundController from '../systems/FootstepSoundController.js?v=2026-08-09-woodpecker-event-55';
import JourneyManager from '../systems/JourneyManager.js';
import SideBySideFormation from '../systems/SideBySideFormation.js';
import WorldLayer from '../systems/WorldLayer.js?v=2026-08-09-woodpecker-event-55';
import GameHud from '../ui/GameHud.js';

const Phaser = window.Phaser;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.game);
  }

  create(data = {}) {
    const journeyState = this.getJourneyState(data);

    this.worldLayer = new WorldLayer(this);

    this.girlOne = new GirlOne(this, PLAYER_STARTS.girlOne.x, PLAYER_STARTS.girlOne.y);
    this.girlTwo = new GirlTwo(this, PLAYER_STARTS.girlTwo.x, PLAYER_STARTS.girlTwo.y);

    this.formation = new SideBySideFormation(this.girlOne, this.girlTwo);
    this.applyJourneyState(journeyState);
    this.keyboardController = new KeyboardController(this, this.formation);
    this.journeyManager = new JourneyManager(this, this.formation, this.worldLayer, {
      currentStopIndex: journeyState?.currentStopIndex,
    });
    this.environmentalEventManager = new EnvironmentalEventManager(this, this.formation, this.worldLayer, {
      currentStopIndex: journeyState?.currentStopIndex,
    });
    this.cameraFollowPoint = new CameraFollowPoint(this, [this.girlOne, this.girlTwo], this.worldLayer.bounds);
    this.footstepSoundController = new FootstepSoundController(this, this.formation);
    this.hud = new GameHud(this, this.girlOne, this.girlTwo);

    this.prepareFutureLearningEvents();
    this.cameras.main.fadeIn(350, 10, 24, 18);
  }

  getJourneyState(data) {
    // Nova partida sempre volta ao inicio da Alameda, mesmo apos os creditos.
    return data.resetJourney ? null : data.journeyState;
  }

  update() {
    if (!this.journeyManager.isTransitioning) {
      this.keyboardController.update();
    }

    this.journeyManager.update();
    this.environmentalEventManager.update();
    this.footstepSoundController.update();
    this.cameraFollowPoint.update();
    this.hud.update();
  }

  applyJourneyState(journeyState) {
    if (!journeyState?.resumeCenterX) {
      return;
    }

    this.formation.setCenter(journeyState.resumeCenterX, PLAYER_STARTS.girlOne.y, PLAYER_DIRECTIONS.right);
  }

  prepareFutureLearningEvents() {
    // Futuro: paradas na alameda, NPCs, pontos de interesse, dialogos,
    // quizzes, puzzles, sons, musica, inventario, fases e salvamento.
    this.learningEventAnchors = [];
  }
}
