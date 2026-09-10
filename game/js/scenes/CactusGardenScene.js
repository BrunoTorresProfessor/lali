import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-09-10-sea-77';
import GuidedVisitScene from './GuidedVisitScene.js?v=2026-09-10-sea-77';

const Phaser = window.Phaser;

// Narration split into five illustrated pages, with the requested capitalization.
export const CACTUS_DIALOGUE = Object.freeze([
  { background: ASSET_KEYS.cactusGarden, text: 'Olá, você está no cactário do jardim botânico do Rio de Janeiro!' },
  { background: ASSET_KEYS.cactusOverview, text: 'Aqui moram muitos cactos e outras plantas suculentas,' },
  { background: ASSET_KEYS.cactusGreenhouses, text: 'Cada uma com um jeitinho especial de viver.' },
  { background: ASSET_KEYS.cactusGiants, text: 'Tem planta com espinho, pequenininha e grandona…' },
  { background: ASSET_KEYS.cactusSucculents, text: 'E a maioria delas acumula água em seus tecidos para sobreviver aos períodos de seca nos seus locais de origem' },
]);

export default class CactusGardenScene extends GuidedVisitScene {
  constructor() {
    super(SCENE_KEYS.cactusGarden, ASSET_KEYS.cactusGarden, 'Cactário', 'Thiago', CACTUS_DIALOGUE);
  }

  createGuide() {
    this.add.ellipse(555, 633, 90, 16, 0x132b1c, 0.25).setDepth(2);
    this.thiago = this.add.image(555, 640, ASSET_KEYS.thiago).setOrigin(0.5, 1).setDepth(4);
    this.thiago.setScale(230 / this.thiago.height);
    this.maskThiago();
    // Mouth coordinates are relative to the existing 1024 x 1536 character art.
    this.mouth = this.add.graphics()
      .setPosition(
        this.thiago.x + (533 - this.thiago.width / 2) * this.thiago.scaleX,
        this.thiago.y + (219 - this.thiago.height) * this.thiago.scaleY,
      )
      .setScale(this.thiago.scaleX).setRotation(-0.16).setDepth(5).setVisible(false);
    this.add.text(565, 647, 'Thiago', {
      fontFamily: 'Arial, sans-serif', fontSize: '17px', fontStyle: 'bold',
      color: '#fff7d4', stroke: '#173724', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(6);
  }

  maskThiago() {
    // ImageGen supplied an RGB image with a checkerboard. Clip its silhouette
    // with a native Phaser mask; keep the generated source artwork intact.
    const outline = [
      [543, 25], [508, 29], [481, 44], [464, 65], [454, 89], [451, 122],
      [457, 162], [461, 203], [467, 239], [482, 275], [492, 292],
      [483, 303], [456, 313], [447, 327], [438, 345], [421, 366],
      [394, 392], [375, 429], [348, 476], [317, 505], [268, 520],
      [214, 501], [178, 480], [158, 464], [148, 464], [145, 474],
      [155, 490], [170, 505], [159, 515], [138, 519], [109, 517],
      [91, 516], [81, 521], [83, 530], [96, 542], [107, 558],
      [130, 572], [166, 582], [218, 587], [231, 606], [257, 629],
      [289, 643], [324, 647], [357, 642], [390, 627], [416, 606],
      [418, 649], [409, 698], [407, 748], [416, 790], [423, 818],
      [425, 866], [433, 929], [451, 1004], [471, 1067], [486, 1135],
      [496, 1201], [501, 1253], [515, 1285], [517, 1321],
      [503, 1344], [474, 1369], [449, 1384], [425, 1400], [416, 1419],
      [415, 1444], [430, 1460], [465, 1468], [503, 1465], [547, 1453],
      [590, 1442], [629, 1430], [647, 1418], [656, 1392], [659, 1359],
      [650, 1320], [647, 1289], [654, 1247], [650, 1200], [632, 1129],
      [626, 1090], [617, 1041], [611, 1001], [607, 957], [615, 947],
      [632, 981], [647, 1020], [656, 1086], [669, 1132], [696, 1200],
      [717, 1265], [734, 1309], [758, 1345], [772, 1365],
      [770, 1398], [767, 1433], [780, 1470], [794, 1499], [810, 1515],
      [846, 1524], [886, 1523], [918, 1516], [925, 1500], [918, 1465],
      [902, 1438], [881, 1402], [863, 1375], [845, 1355], [833, 1325],
      [834, 1298], [842, 1268], [842, 1230], [832, 1198], [818, 1160],
      [812, 1118], [809, 1064], [796, 1015], [785, 966], [779, 912],
      [766, 865], [756, 835], [758, 797], [767, 772], [782, 748],
      [826, 728], [850, 699], [866, 667], [881, 632], [889, 604],
      [887, 575], [877, 554], [871, 520], [858, 476], [844, 426],
      [827, 391], [806, 367], [779, 349], [748, 329], [751, 304],
      [737, 278], [707, 257], [680, 247], [667, 215], [660, 178],
      [658, 145], [649, 131], [636, 134], [635, 109], [628, 80],
      [611, 57], [587, 40], [565, 29],
    ];
    const left = this.thiago.x - this.thiago.displayWidth / 2;
    const top = this.thiago.y - this.thiago.displayHeight;
    const points = outline.map(([x, y]) => ({ x: left + x * this.thiago.scaleX, y: top + y * this.thiago.scaleY }));
    const shape = this.make.graphics({ x: 0, y: 0, add: false });
    shape.fillStyle(0xffffff).fillPoints(points, true);
    const mask = shape.createGeometryMask();
    this.thiago.setMask(mask);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.thiago.clearMask();
      mask.destroy();
      shape.destroy();
    });
  }
}
