import { ASSET_KEYS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from '../config.js?v=2026-09-01-monkey-guidance-70';

const Phaser = window.Phaser;

const PHASES = Object.freeze([
  { id: 'visitor-center', title: 'Centro de Visitantes', stopId: 'visitor_center', stopIndex: 0, sceneKey: SCENE_KEYS.visitorCenter, textureKey: ASSET_KEYS.visitorCenter, focusX: 0.42 },
  { id: 'sumauma', title: 'Sumaúma', stopId: 'sumauma', stopIndex: 1, sceneKey: SCENE_KEYS.sumauma, textureKey: ASSET_KEYS.sumauma, focusX: 0.6 },
  { id: 'chafariz', title: 'Chafariz das Musas', stopId: 'chafariz_das_musas', stopIndex: 2, sceneKey: SCENE_KEYS.chafarizDasMusas, textureKey: ASSET_KEYS.chafarizDasMusas, focusX: 0.5 },
  { id: 'lake', title: 'Lago das Vitórias-Régias', stopId: 'frei_leandro_lake', stopIndex: 3, sceneKey: SCENE_KEYS.lake, textureKey: ASSET_KEYS.lake, focusX: 0.58 },
  { id: 'orchid-house', title: 'Orquidário', stopId: 'orchid_house', stopIndex: 4, sceneKey: SCENE_KEYS.orchidHouse, textureKey: ASSET_KEYS.orchidHouse, focusX: 0.58 },
  { id: 'bromeliad-house', title: 'Bromeliário', stopId: 'bromeliad_house', stopIndex: 5, sceneKey: SCENE_KEYS.bromeliadHouse, textureKey: ASSET_KEYS.bromeliadHouse, focusX: 0.62 },
  { id: 'sensory-garden', title: 'Jardim Sensorial', stopId: 'sensory_garden', stopIndex: 6, sceneKey: SCENE_KEYS.sensoryGarden, textureKey: ASSET_KEYS.sensoryGarden, focusX: 0.52 },
  { id: 'museum', title: 'Museu do Jardim Botânico', stopId: 'museum', stopIndex: 7, sceneKey: SCENE_KEYS.museum, textureKey: ASSET_KEYS.museum, focusX: 0.63 },
  { id: 'greenhouses', title: 'Estufas', stopId: 'greenhouses', stopIndex: 8, sceneKey: SCENE_KEYS.greenhouses, textureKey: ASSET_KEYS.greenhouses, focusX: 0.5 },
  { id: 'carnivorous-greenhouse', title: 'Estufa das Plantas Carnívoras', stopId: 'greenhouses', stopIndex: 8, sceneKey: SCENE_KEYS.carnivorousGreenhouse, textureKey: ASSET_KEYS.carnivorousPlantOpen, focusX: 0.5 },
  { id: 'herbarium', title: 'Herbário RB', stopId: 'herbarium_rb', stopIndex: 9, sceneKey: SCENE_KEYS.herbarium, textureKey: ASSET_KEYS.herbarium, focusX: 0.62 },
  { id: 'national-school', title: 'Escola Nacional de Botânica Tropical', stopId: 'national_school', stopIndex: 10, sceneKey: SCENE_KEYS.nationalSchool, textureKey: ASSET_KEYS.creditsBackground, focusX: 0.62 },
]);

const PANEL_Y = GAME_HEIGHT - 31;
const PANEL_WIDTH = 720;
const MARKER_SPACING = 52;
const MARKER_OFFSETS = Object.freeze([0, -5, 3, -4, 4, -3, 5, 0, -4, 4, -3, 1]);

export const PHASE_MAP_TOP = PANEL_Y - 30;

export default class PhaseMap {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.currentStopIndex = options.currentStopIndex ?? 0;
    this.activeSceneKey = options.activeSceneKey;
    this.onSelect = options.onSelect;
    this.isLocked = false;

    this.container = this.scene.add.container(0, 0).setDepth(105).setScrollFactor(0);
    this.createPanel();
    this.createRoute();
    this.createMarkers();
    this.createTooltip();
  }

  createPanel() {
    const shadow = this.scene.add
      .rectangle(GAME_WIDTH / 2, PANEL_Y + 2, PANEL_WIDTH + 6, 60, 0x06140f, 0.34)
      .setStrokeStyle(1, 0x09140d, 0.5);
    const background = this.scene.add
      .rectangle(GAME_WIDTH / 2, PANEL_Y, PANEL_WIDTH, 56, 0x10271c, 0.72)
      .setStrokeStyle(2, 0xd5b75c, 0.48);

    this.container.add([shadow, background]);
  }

  createRoute() {
    const points = this.getMarkerPoints();
    const route = this.scene.add.graphics();

    route.lineStyle(8, 0x543d24, 0.72);
    route.beginPath();
    route.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => route.lineTo(point.x, point.y));
    route.strokePath();

    route.lineStyle(4, 0xa9d46e, 0.92);
    route.beginPath();
    route.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => route.lineTo(point.x, point.y));
    route.strokePath();

    this.container.add(route);
  }

  createMarkers() {
    const points = this.getMarkerPoints();

    this.markers = PHASES.map((phase, index) => {
      const point = points[index];
      const marker = this.scene.add.container(point.x, point.y);
      const state = this.getMarkerState(phase);
      const icon = this.scene.add.image(0, 0, phase.textureKey);
      const frame = this.scene.add
        .rectangle(0, 0, 40, 40, 0x000000, 0.06)
        .setStrokeStyle(state.strokeWidth, state.strokeColor, 0.96)
        .setInteractive({ useHandCursor: true });

      this.cropIcon(icon, phase);
      marker.add([icon, frame]);
      marker.setDepth(2);
      frame.on('pointerover', () => this.handlePointerOver(marker, phase));
      frame.on('pointerout', () => this.handlePointerOut(marker));
      frame.on('pointerdown', (pointer, localX, localY, event) => {
        event.stopPropagation();
        this.selectPhase(phase);
      });
      this.container.add(marker);

      return marker;
    });
  }

  getMarkerPoints() {
    const routeWidth = (PHASES.length - 1) * MARKER_SPACING;
    const startX = GAME_WIDTH / 2 - routeWidth / 2;

    return PHASES.map((phase, index) => ({
      x: startX + index * MARKER_SPACING,
      y: PANEL_Y + MARKER_OFFSETS[index],
    }));
  }

  getMarkerState(phase) {
    if (phase.sceneKey === this.activeSceneKey) {
      return { strokeColor: 0xffdf78, strokeWidth: 3 };
    }

    if (phase.stopIndex === this.currentStopIndex) {
      return { strokeColor: 0xffdf78, strokeWidth: 3 };
    }

    if (phase.stopIndex < this.currentStopIndex) {
      return { strokeColor: 0x9ed27c, strokeWidth: 2 };
    }

    return { strokeColor: 0x729265, strokeWidth: 2 };
  }

  cropIcon(icon, phase) {
    const sourceImage = this.scene.textures.get(phase.textureKey).getSourceImage();
    const cropSize = Math.min(sourceImage.width, sourceImage.height);
    const focusX = sourceImage.width * (phase.focusX ?? 0.5);
    const cropX = Phaser.Math.Clamp(focusX - cropSize / 2, 0, sourceImage.width - cropSize);
    const cropY = Math.max(0, (sourceImage.height - cropSize) / 2);
    const thumbnailKey = `phase-map-thumbnail-${phase.id}`;

    if (!this.scene.textures.exists(thumbnailKey)) {
      const thumbnail = this.scene.textures.createCanvas(thumbnailKey, 40, 40);
      const context = thumbnail.getContext();

      context.drawImage(sourceImage, cropX, cropY, cropSize, cropSize, 0, 0, 40, 40);
      thumbnail.refresh();
    }

    icon.setTexture(thumbnailKey).setDisplaySize(40, 40);
  }

  createTooltip() {
    this.tooltip = this.scene.add.container(GAME_WIDTH / 2, PANEL_Y - 46).setDepth(130).setAlpha(0);
    this.tooltipBackground = this.scene.add
      .rectangle(0, 0, 240, 30, 0x10271c, 0.9)
      .setStrokeStyle(1, 0xf2d278, 0.65);
    this.tooltipText = this.scene.add
      .text(0, 0, '', {
        color: '#fff8cf',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        stroke: '#14321f',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tooltip.add([this.tooltipBackground, this.tooltipText]);
  }

  handlePointerOver(marker, phase) {
    this.scene.tweens.add({ targets: marker, scale: 1.1, duration: 110, ease: 'Sine.easeOut' });
    this.tooltipText.setText(phase.title);
    this.tooltipBackground.width = Math.max(180, this.tooltipText.width + 28);
    this.tooltip.setAlpha(1);
  }

  handlePointerOut(marker) {
    this.scene.tweens.add({ targets: marker, scale: 1, duration: 110, ease: 'Sine.easeOut' });
    this.tooltip.setAlpha(0);
  }

  selectPhase(phase) {
    if (this.isLocked) {
      return;
    }

    this.isLocked = true;
    this.tooltip.setAlpha(0);
    this.onSelect?.(phase);
  }
}
