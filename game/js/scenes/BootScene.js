import {
  ASSET_KEYS,
  ASSET_PATHS,
  PLAYER_ANIMATION_DEFINITIONS,
  PLAYER_CHARACTER_ASSETS,
  PLAYER_FRAME,
  ROUTE_CHUNKS,
  SCENE_KEYS,
  withAssetVersion,
} from '../config.js?v=2026-08-26-seed-reward-sound-58';

const Phaser = window.Phaser;

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  preload() {
    this.load.image(ASSET_KEYS.alameda, ASSET_PATHS.alameda);
    this.load.image(ASSET_KEYS.bromeliadHouse, ASSET_PATHS.bromeliadHouse);
    this.load.image(ASSET_KEYS.bromeliadSensoryTransition, ASSET_PATHS.bromeliadSensoryTransition);
    this.load.image(ASSET_KEYS.bromeliadTransition, ASSET_PATHS.bromeliadTransition);
    this.load.image(ASSET_KEYS.capuchinMonkeyRunner, ASSET_PATHS.capuchinMonkeyRunner);
    this.load.image(ASSET_KEYS.chafarizDasMusas, ASSET_PATHS.chafarizDasMusas);
    this.load.image(ASSET_KEYS.creditsBackground, ASSET_PATHS.creditsBackground);
    this.load.image(ASSET_KEYS.enbtTransition, ASSET_PATHS.enbtTransition);
    this.load.image(ASSET_KEYS.fishJump, ASSET_PATHS.fishJump);
    this.load.image(ASSET_KEYS.greenhouses, ASSET_PATHS.greenhouses);
    this.load.image(ASSET_KEYS.herbarium, ASSET_PATHS.herbarium);
    this.load.image(ASSET_KEYS.herbariumTransition, ASSET_PATHS.herbariumTransition);
    this.load.image(ASSET_KEYS.lake, ASSET_PATHS.lake);
    this.load.image(ASSET_KEYS.lakeTransition, ASSET_PATHS.lakeTransition);
    this.load.image(ASSET_KEYS.museum, ASSET_PATHS.museum);
    this.load.image(ASSET_KEYS.museumGreenhousesTransition, ASSET_PATHS.museumGreenhousesTransition);
    this.load.image(ASSET_KEYS.museumSegment, ASSET_PATHS.museumSegment);
    this.load.image(ASSET_KEYS.orchidHouse, ASSET_PATHS.orchidHouse);
    this.load.image(ASSET_KEYS.orchidTransition, ASSET_PATHS.orchidTransition);
    this.load.image(ASSET_KEYS.sensoryGarden, ASSET_PATHS.sensoryGarden);
    this.load.image(ASSET_KEYS.sensoryMuseumTransition, ASSET_PATHS.sensoryMuseumTransition);
    this.load.image(ASSET_KEYS.seedIcon, ASSET_PATHS.seedIcon);
    this.load.image(ASSET_KEYS.sumauma, ASSET_PATHS.sumauma);
    this.load.image(ASSET_KEYS.titleBackground, ASSET_PATHS.titleBackground);
    this.load.image(ASSET_KEYS.transitionGarden, ASSET_PATHS.transitionGarden);
    this.load.image(ASSET_KEYS.toucanBlackBill, ASSET_PATHS.toucanBlackBill);
    this.load.image(ASSET_KEYS.visitorCenter, ASSET_PATHS.visitorCenter);
    this.load.image(ASSET_KEYS.visitorCenterSegment, ASSET_PATHS.visitorCenterSegment);
    this.load.image(ASSET_KEYS.visitorCenterTransition, ASSET_PATHS.visitorCenterTransition);
    this.load.spritesheet(ASSET_KEYS.woodpeckerPeck, ASSET_PATHS.woodpeckerPeck, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.loadContinuousRouteChunks();
    this.load.json(ASSET_KEYS.worldMap, ASSET_PATHS.worldMap);
    this.load.audio(ASSET_KEYS.capuchinMonkeysChatter, ASSET_PATHS.capuchinMonkeysChatter);
    this.load.audio(ASSET_KEYS.fishWaterSplash, ASSET_PATHS.fishWaterSplash);
    this.load.audio(ASSET_KEYS.footstepSoftA, ASSET_PATHS.footstepSoftA);
    this.load.audio(ASSET_KEYS.footstepSoftB, ASSET_PATHS.footstepSoftB);
    this.load.audio(ASSET_KEYS.menuMusic, ASSET_PATHS.menuMusic);
    this.load.audio(ASSET_KEYS.seedRewardSound, ASSET_PATHS.seedRewardSound);
    this.load.audio(ASSET_KEYS.stoneWaterSplash, ASSET_PATHS.stoneWaterSplash);
    this.load.audio(ASSET_KEYS.woodpeckerDrumming, ASSET_PATHS.woodpeckerDrumming);
    this.loadPlayerSpritesheets();
  }

  create() {
    this.scene.start(SCENE_KEYS.title);
  }

  loadContinuousRouteChunks() {
    ROUTE_CHUNKS.forEach((chunkConfig) => {
      this.load.image(chunkConfig.key, chunkConfig.path);
    });
  }

  loadPlayerSpritesheets() {
    Object.values(PLAYER_CHARACTER_ASSETS).forEach((characterConfig) => {
      Object.values(PLAYER_ANIMATION_DEFINITIONS).forEach((animationConfig) => {
        this.load.spritesheet(
          this.getPlayerTextureKey(characterConfig, animationConfig),
          this.getPlayerSpritesheetPath(characterConfig, animationConfig),
          PLAYER_FRAME,
        );
      });
    });
  }

  getPlayerTextureKey(characterConfig, animationConfig) {
    return `${characterConfig.id}-${animationConfig.fileName}`;
  }

  getPlayerSpritesheetPath(characterConfig, animationConfig) {
    return withAssetVersion(`assets/player/${characterConfig.directory}/${characterConfig.filePrefix}_${animationConfig.fileName}.png`);
  }
}
