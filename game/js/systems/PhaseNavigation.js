import { ASSET_KEYS, JOURNEY_RETURN_OFFSET } from '../config.js?v=2026-08-30-phase-map-65';

export default class PhaseNavigation {
  static createJourneyState(scene, phase, seedCount) {
    const worldMap = scene.cache.json.get(ASSET_KEYS.worldMap);

    if (!worldMap?.modules?.length) {
      throw new Error('World map JSON was not loaded or has no modules.');
    }

    const worldWidth = worldMap.modules.reduce((total, module) => total + this.getModuleWidth(module), 0);
    let cursorX = 0;
    let stopIndex = 0;

    for (const module of worldMap.modules) {
      const width = this.getModuleWidth(module);

      if (module.type === 'stop') {
        const isTarget = module.id === phase.stopId || module.sourceStopId === phase.stopId;

        if (isTarget) {
          const resumeOffset = module.resumeOffset ?? JOURNEY_RETURN_OFFSET;

          return {
            currentStopIndex: stopIndex + 1,
            resumeCenterX: Math.min(cursorX + width + resumeOffset, worldWidth),
            seedCount,
          };
        }

        stopIndex += 1;
      }

      cursorX += width;
    }

    throw new Error(`Phase map references unknown stop "${phase.stopId}".`);
  }

  static getModuleWidth(module) {
    if (!Number.isFinite(module.width) || module.width <= 0) {
      throw new Error(`World module "${module.id}" needs an explicit width for phase navigation.`);
    }

    return module.width;
  }
}
