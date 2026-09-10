import { ASSET_KEYS, SCENE_KEYS } from '../config.js?v=2026-09-10-sea-77';
import GuidedVisitScene from './GuidedVisitScene.js?v=2026-09-10-sea-77';

// User-supplied narration, split into compact pages without changing its wording.
export const ENVIRONMENTAL_EDUCATION_DIALOGUE = Object.freeze([
  'Olá! Vocês estão no SEA – nosso Serviço de Educação Ambiental,',
  'onde são realizadas várias atividades lúdicas, dinâmicas e informativas de divulgação científica e de educação ambiental.',
  'Aqui vocês assistem a vídeos, participam de jogos, pinturas, desenhos',
  'e muitas atividades interessantes e investigativas.',
].map(text => Object.freeze({ background: ASSET_KEYS.environmentalEducation, text })));

export default class EnvironmentalEducationScene extends GuidedVisitScene {
  constructor() {
    super(
      SCENE_KEYS.environmentalEducation,
      ASSET_KEYS.environmentalEducation,
      'Serviço de Educação Ambiental',
      'Lucas',
      ENVIRONMENTAL_EDUCATION_DIALOGUE,
    );
  }

  createGuide() {
    // Lucas is painted into the room, preserving the lighting and his likeness.
    // These landmarks are measured on the final 1672 x 941 painting.
    const left = this.background.x - this.background.displayWidth / 2;
    const top = this.background.y - this.background.displayHeight / 2;
    const scale = this.background.scaleX;
    this.createArmGesture(left, top, scale);
    this.mouth = this.add.graphics().setPosition(left + 623 * scale, top + 459 * scale)
      .setScale(scale * 0.27).setRotation(-0.25).setDepth(5).setVisible(false);
    this.add.text(left + 650 * scale, top + 793 * scale, 'Lucas', {
      fontFamily: 'Arial, sans-serif', fontSize: '17px', fontStyle: 'bold',
      color: '#fff7d4', stroke: '#173724', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(6);
  }

  createCharacters() {
    super.createCharacters();
    this.characterEntries.forEach((entry, index) => {
      entry.sprite.setY(530);
      entry.destination = 395 - index * 85;
    });
  }

  createArmGesture(left, top, scale) {
    // A small repainted patch reveals the shelf behind the moving arm. The
    // original artwork supplies the arm, clipped with a native Phaser mask.
    this.armBackground = this.add.image(left, top, ASSET_KEYS.lucasArmBackground)
      .setOrigin(0).setScale(scale).setCrop(528, 497, 78, 54)
      .setDepth(2).setVisible(false);
    const pivot = { x: 594, y: 526 };
    this.gesturingArm = this.add.image(left + pivot.x * scale, top + pivot.y * scale, ASSET_KEYS.environmentalEducation)
      .setOrigin(pivot.x / 1672, pivot.y / 941).setScale(scale).setDepth(3).setVisible(false);
    this.armOutline = [
      [584, 520], [604, 529], [603, 532], [597, 541], [591, 546],
      [585, 548], [579, 547], [571, 543], [565, 539], [560, 534],
      [557, 530], [552, 530], [546, 528], [540, 524], [536, 520],
      [532, 518], [531, 516], [534, 516], [541, 518], [543, 518],
      [533, 514], [532, 512], [534, 512], [542, 514], [546, 514],
      [551, 512], [549, 508], [548, 502], [550, 498], [553, 501],
      [559, 509], [564, 515], [567, 520], [575, 523], [582, 525],
    ].map(([x, y]) => ({ x: (x - pivot.x) * scale, y: (y - pivot.y) * scale }));
    this.armMaskShape = this.make.graphics({ x: 0, y: 0, add: false });
    const mask = this.armMaskShape.createGeometryMask();
    this.gesturingArm.setMask(mask);
    this.setArmRotation(0);
    this.events.once(window.Phaser.Scenes.Events.SHUTDOWN, () => {
      this.armTween?.remove();
      this.armTween = null;
      this.gesturingArm.clearMask();
      mask.destroy();
      this.armMaskShape.destroy();
      this.gesturingArm = null;
    });
  }

  setArmRotation(rotation) {
    if (!this.gesturingArm?.active) return;
    this.gesturingArm.setRotation(rotation);
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const points = this.armOutline.map(({ x, y }) => ({
      x: this.gesturingArm.x + x * cos - y * sin,
      y: this.gesturingArm.y + x * sin + y * cos,
    }));
    this.armMaskShape.clear().fillStyle(0xffffff).fillPoints(points, true);
  }

  startSpeaking(text) {
    super.startSpeaking(text);
    this.armBackground.setVisible(true);
    this.gesturingArm.setVisible(true);
    this.armTween = this.tweens.addCounter({
      from: 0, to: Math.PI * 2, duration: 1700, repeat: -1,
      onUpdate: tween => {
        const phase = tween.getValue();
        this.setArmRotation(0.22 * Math.sin(phase) + 0.05 * Math.sin(phase * 2));
      },
    });
  }

  stopSpeaking() {
    super.stopSpeaking();
    this.armTween?.remove();
    this.armTween = null;
    this.setArmRotation(0);
    if (this.gesturingArm?.active) this.gesturingArm.setVisible(false);
    if (this.armBackground?.active) this.armBackground.setVisible(false);
  }
}
