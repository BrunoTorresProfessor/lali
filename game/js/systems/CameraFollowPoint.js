import { CAMERA_LERP } from '../config.js';

export default class CameraFollowPoint {
  constructor(scene, targets, worldBounds) {
    this.scene = scene;
    this.targets = targets;
    this.followPoint = this.scene.add.zone(0, 0, 1, 1);

    this.configureCamera(worldBounds);
  }

  configureCamera(worldBounds) {
    const camera = this.scene.cameras.main;

    camera.setBounds(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);
    camera.setRoundPixels(true);

    this.update();
    camera.centerOn(this.followPoint.x, this.followPoint.y);
    camera.startFollow(this.followPoint, true, CAMERA_LERP, CAMERA_LERP);
  }

  update() {
    const center = this.getTargetsCenter();

    this.followPoint.setPosition(center.x, center.y);
  }

  getTargetsCenter() {
    const total = this.targets.reduce(
      (accumulator, target) => ({
        x: accumulator.x + target.x,
        y: accumulator.y + target.y,
      }),
      { x: 0, y: 0 },
    );

    return {
      x: total.x / this.targets.length,
      y: total.y / this.targets.length,
    };
  }
}
