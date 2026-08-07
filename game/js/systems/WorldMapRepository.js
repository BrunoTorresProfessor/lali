import { ASSET_KEYS } from '../config.js';

export default class WorldMapRepository {
  static get(scene) {
    const worldMap = scene.cache.json.get(ASSET_KEYS.worldMap);

    if (!worldMap?.modules?.length) {
      throw new Error('World map JSON was not loaded or has no modules.');
    }

    return worldMap;
  }
}
