const Phaser = window.Phaser;

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const PLAYER_SPEED = 180;
export const ASSET_VERSION = '2026-08-26-seed-reward-sound-58';
export const PHASE_SEED_REWARD = 1;

export const withAssetVersion = (path) => `${path}?v=${ASSET_VERSION}`;

export const SCENE_KEYS = Object.freeze({
  boot: 'BootScene',
  title: 'TitleScene',
  game: 'GameScene',
  bromeliadHouse: 'BromeliadHouseScene',
  chafarizDasMusas: 'ChafarizDasMusasScene',
  credits: 'CreditsScene',
  greenhouses: 'GreenhousesScene',
  herbarium: 'HerbariumScene',
  lake: 'LakeScene',
  nationalSchool: 'NationalSchoolScene',
  sensoryGarden: 'SensoryGardenScene',
  sumauma: 'SumaumaScene',
  visitorCenter: 'VisitorCenterScene',
  museum: 'MuseumScene',
  orchidHouse: 'OrchidHouseScene',
});

export const ASSET_KEYS = Object.freeze({
  alameda: 'alameda-palmeiras',
  bromeliadHouse: 'bromeliario',
  bromeliadTransition: 'transicao-orquidario-bromeliario',
  bromeliadSensoryTransition: 'transicao-bromeliario-jardim-sensorial',
  capuchinMonkeysChatter: 'capuchin-monkeys-chatter',
  capuchinMonkeyRunner: 'capuchin-monkey-runner',
  chafarizDasMusas: 'chafariz-das-musas',
  creditsBackground: 'enbt',
  enbtTransition: 'transicao-estufas-enbt',
  greenhouses: 'estufas',
  herbarium: 'herbario-rb',
  herbariumTransition: 'transicao-centro-herbario',
  footstepSoftA: 'footstep-soft-a',
  footstepSoftB: 'footstep-soft-b',
  fishJump: 'fish-jump',
  fishWaterSplash: 'fish-water-splash',
  lake: 'lago-frei-leandro',
  lakeTransition: 'transicao-herbario-lago',
  menuMusic: 'menu-music',
  museum: 'museum',
  museumGreenhousesTransition: 'transicao-museu-estufas',
  museumSegment: 'museum-segment',
  orchidHouse: 'orquidario',
  orchidTransition: 'transicao-lago-orquidario',
  sensoryGarden: 'jardim-sensorial',
  sensoryMuseumTransition: 'transicao-jardim-sensorial-museu',
  seedIcon: 'seed-icon',
  seedRewardSound: 'seed-reward-sound',
  stoneWaterSplash: 'stone-water-splash',
  sumauma: 'sumauma',
  titleBackground: 'title-background',
  transitionGarden: 'transition-garden',
  toucanBlackBill: 'tucano-bico-preto',
  visitorCenter: 'visitor-center',
  visitorCenterSegment: 'visitor-center-segment',
  visitorCenterTransition: 'transicao-alameda-centro',
  woodpeckerDrumming: 'woodpecker-drumming',
  woodpeckerPeck: 'woodpecker-peck',
  worldMap: 'world-map-jardim-botanico',
});

export const ASSET_PATHS = Object.freeze({
  // Para novos cenarios, adicione uma chave aqui e carregue no BootScene.
  alameda: 'assets/cartoon/alameda-palmeiras-horizontal.png',
  bromeliadHouse: 'assets/cartoon/bromeliario-unificado.png',
  bromeliadSensoryTransition: 'assets/cartoon/transicao-bromeliario-jardim-sensorial.png',
  bromeliadTransition: 'assets/cartoon/transicao-orquidario-bromeliario.png',
  capuchinMonkeysChatter: withAssetVersion('assets/audio/capuchin-monkeys-chatter.wav'),
  capuchinMonkeyRunner: withAssetVersion('assets/cartoon/capuchin-monkey-run.png'),
  chafarizDasMusas: 'assets/cartoon/chafariz-das-musas-unificado.png',
  creditsBackground: 'assets/cartoon/enbt-unificado.png',
  enbtTransition: 'assets/cartoon/transicao-estufas-enbt.png',
  greenhouses: 'assets/cartoon/estufas-unificado.png',
  herbarium: 'assets/cartoon/herbario-rb-unificado.png',
  herbariumTransition: 'assets/cartoon/transicao-centro-herbario.png',
  footstepSoftA: withAssetVersion('assets/audio/footstep-soft-a.wav'),
  footstepSoftB: withAssetVersion('assets/audio/footstep-soft-b.wav'),
  fishJump: withAssetVersion('assets/cartoon/fish-jump.png'),
  fishWaterSplash: withAssetVersion('assets/audio/fish-water-splash.wav'),
  lake: 'assets/cartoon/lago-frei-leandro-unificado.png',
  lakeTransition: 'assets/cartoon/transicao-herbario-lago.png',
  // Ambientes da jornada: use imagens reais ja adicionadas ao projeto.
  museum: 'assets/cartoon/museu-unificado.png',
  museumGreenhousesTransition: 'assets/cartoon/transicao-museu-estufas.png',
  museumSegment: 'assets/cartoon/museu-segmento.png',
  orchidHouse: 'assets/cartoon/orquidario-unificado.png',
  orchidTransition: 'assets/cartoon/transicao-lago-orquidario.png',
  sensoryGarden: 'assets/cartoon/jardim-sensorial-unificado.png',
  sensoryMuseumTransition: 'assets/cartoon/transicao-jardim-sensorial-museu.png',
  seedIcon: withAssetVersion('assets/ui/seed-icon.png'),
  seedRewardSound: withAssetVersion('assets/audio/seed-reward.wav'),
  stoneWaterSplash: withAssetVersion('assets/audio/stone-water-splash.wav'),
  sumauma: withAssetVersion('assets/cartoon/sumauma-unificado.png'),
  // Tela inicial: trocar esta imagem para atualizar a capa do jogo.
  titleBackground: 'assets/menu/title-background.png',
  transitionGarden: 'assets/cartoon/transicao-jardim.png',
  toucanBlackBill: withAssetVersion('assets/cartoon/tucano-bico-preto.png'),
  visitorCenter: 'assets/cartoon/centro-visitantes-unificado.png',
  visitorCenterSegment: 'assets/cartoon/centro-visitantes-segmento.png',
  visitorCenterTransition: 'assets/cartoon/transicao-alameda-centro.png',
  woodpeckerDrumming: withAssetVersion('assets/audio/woodpecker-drumming.wav'),
  woodpeckerPeck: withAssetVersion('assets/cartoon/woodpecker-peck.png'),
  worldMap: withAssetVersion('assets/world/maps/jardim-botanico-continuo.json'),
  // Musica curta em loop para a tela inicial.
  menuMusic: 'assets/audio/menu-theme.wav',
});

export const ROUTE_CHUNK_COUNT = 19;

export const ROUTE_CHUNKS = Object.freeze(
  Array.from({ length: ROUTE_CHUNK_COUNT }, (_, index) => {
    const id = String(index + 1).padStart(3, '0');

    return Object.freeze({
      key: `route-chunk-${id}`,
      path: withAssetVersion(`assets/cartoon/route-continuous/route-chunk-${id}.png`),
    });
  }),
);

export const PLAYER_FRAME = Object.freeze({
  frameWidth: 192,
  frameHeight: 256,
});

export const PLAYER_DIRECTIONS = Object.freeze({
  down: 'down',
  up: 'up',
  left: 'left',
  right: 'right',
});

export const PLAYER_ANIMATION_STATES = Object.freeze({
  idle: 'idle',
  walk: 'walk',
  run: 'run',
  celebrate: 'celebrate',
  talk: 'talk',
  point: 'point',
  look: 'look',
  pickObject: 'pickObject',
  happy: 'happy',
  sad: 'sad',
  surprised: 'surprised',
});

export const PLAYER_ANIMATION_DEFINITIONS = Object.freeze({
  idle: Object.freeze({ fileName: 'idle', frames: 6, frameRate: 6, repeat: -1 }),
  walk: Object.freeze({ fileName: 'walk', frames: 8, frameRate: 9, repeat: -1 }),
  run: Object.freeze({ fileName: 'run', frames: 8, frameRate: 14, repeat: -1 }),
  celebrate: Object.freeze({ fileName: 'celebrate', frames: 10, frameRate: 12, repeat: 0 }),
  talk: Object.freeze({ fileName: 'talk', frames: 6, frameRate: 9, repeat: -1 }),
  point: Object.freeze({ fileName: 'point', frames: 6, frameRate: 8, repeat: 0 }),
  look: Object.freeze({ fileName: 'look', frames: 6, frameRate: 6, repeat: -1 }),
  pickObject: Object.freeze({ fileName: 'pick_object', frames: 10, frameRate: 10, repeat: 0 }),
  happy: Object.freeze({ fileName: 'happy', frames: 6, frameRate: 8, repeat: 0 }),
  sad: Object.freeze({ fileName: 'sad', frames: 6, frameRate: 6, repeat: -1 }),
  surprised: Object.freeze({ fileName: 'surprised', frames: 6, frameRate: 8, repeat: 0 }),
});

export const PLAYER_CHARACTER_ASSETS = Object.freeze({
  girlOne: Object.freeze({
    id: 'girl-one',
    directory: 'girl1',
    filePrefix: 'girl1',
    displayScale: 0.56,
    body: Object.freeze({ width: 66, height: 118, offsetX: 63, offsetY: 112 }),
  }),
  girlTwo: Object.freeze({
    id: 'girl-two',
    directory: 'girl2',
    filePrefix: 'girl2',
    displayScale: 0.54,
    body: Object.freeze({ width: 58, height: 98, offsetX: 67, offsetY: 132 }),
  }),
});

export const PLAYER_STARTS = Object.freeze({
  girlOne: Object.freeze({ x: 520, y: 590 }),
  girlTwo: Object.freeze({ x: 610, y: 590 }),
});

export const FORMATION_GAP = PLAYER_STARTS.girlTwo.x - PLAYER_STARTS.girlOne.x;

export const CAMERA_LERP = 0.08;
export const JOURNEY_RETURN_OFFSET = 180;
export const ENVIRONMENT_VISIT_DURATION = 4200;
export const FOOTSTEP_AUDIO = Object.freeze({
  intervalMs: 330,
  volume: 0.16,
  rateVariation: 0.04,
});

export function createGameConfig(scenes) {
  return {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#101416',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    scene: scenes,
  };
}
