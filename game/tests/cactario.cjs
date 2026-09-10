const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const narration = 'Olá, você está no cactário do jardim botânico do Rio de Janeiro! Aqui moram muitos cactos e outras plantas suculentas, Cada uma com um jeitinho especial de viver. Tem planta com espinho, pequenininha e grandona… E a maioria delas acumula água em seus tecidos para sobreviver aos períodos de seca nos seus locais de origem';
const output = process.env.CACTARIO_TEST_OUTPUT || path.join(__dirname, '../../output/cactario');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1314, height: 754 } });
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('PAGE ERROR:', error.message); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(process.env.GAME_URL || 'http://127.0.0.1:8000/');
    await page.waitForFunction(() => window.irmasLaLiGame?.scene.isActive('TitleScene'), { timeout: 60000 });
    const canvas = page.locator('canvas');
    async function clickGame(x, y) {
      const box = await canvas.boundingBox();
      await page.mouse.click(box.x + x * box.width / 1280, box.y + y * box.height / 720);
    }
    async function clickNext() {
      const center = await page.evaluate(() => {
        const s = window.irmasLaLiGame.scene.getScene('CactusGardenScene');
        const bounds = s.nextButton.getBounds();
        return { x: bounds.centerX, y: bounds.centerY };
      });
      await clickGame(center.x, center.y);
    }
    await clickGame(640, 616);
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('GameScene'));
    // Reach the new stop through the same journey manager used during walking.
    await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('GameScene');
      const stop = s.worldLayer.stops.find(stop => stop.id === 'cactus_garden');
      s.journeyManager.currentStopIndex = stop.stopIndex;
      s.formation.setCenter(stop.entryX + 1, 590, 'right');
    });
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('CactusGardenScene') && window.irmasLaLiGame.scene.getScene('CactusGardenScene').ready);
    const actual = await page.evaluate(async () => {
      const { CACTUS_DIALOGUE } = await import('/js/scenes/CactusGardenScene.js?v=2026-09-10-sea-75');
      return CACTUS_DIALOGUE.map(page => page.text).join(' ');
    });
    assert.equal(actual, narration);
    const getState = () => page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('CactusGardenScene');
      return { index: s.pageIndex, texture: s.background.texture.key, seeds: s.journeyState.seedCount,
        stopIndex: s.journeyState.currentStopIndex, textBottom: s.dialogueText.y + s.dialogueText.height,
        controlsY: s.nextButton.y, cardArea: s.dialogueWidth * s.dialogueHeight,
        cardBottom: s.dialogueContainer.y + s.dialogueHeight, speaking: s.isSpeaking,
        mouthVisible: s.mouth.visible, opening: s.mouthOpening,
        characters: s.characterEntries.length, markers: s.phaseMap.markers.map(m => [m.x, m.y]) };
    });
    const first = await getState();
    assert.equal(first.characters, 2);
    assert.equal(first.markers.length, 14);
    assert(first.markers.every(point => point.every(Number.isFinite)));
    assert.equal(first.speaking, true);
    assert.equal(first.mouthVisible, true);
    const openings = [];
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(80);
      openings.push((await getState()).opening);
    }
    assert(Math.max(...openings) - Math.min(...openings) > 0.5, 'Thiago must visibly open and close his mouth');
    await canvas.screenshot({ path: path.join(output, 'cactario-boas-vindas.png') });
    // This phase must not inherit the 4.2-second automatic exit of other scenes.
    await page.waitForTimeout(4500);
    assert.equal((await getState()).index, 0);
    assert.equal((await getState()).speaking, false);
    assert.equal((await getState()).mouthVisible, false);
    const waitPage = index => page.waitForFunction(i => {
      const s = window.irmasLaLiGame.scene.getScene('CactusGardenScene');
      return s.pageIndex === i && !s.isChangingPage;
    }, index);
    await clickNext();
    await waitPage(1);
    await page.keyboard.press('ArrowLeft');
    await waitPage(0);
    const textures = new Set([(await getState()).texture]);
    for (let index = 1; index < 5; index++) {
      await page.keyboard.press('Space');
      await waitPage(index);
      const state = await getState();
      assert(state.textBottom < state.controlsY, 'Dialogue overlaps controls');
      assert(state.cardArea < 760 * 238 * 0.65, 'Compact card must leave more scenery visible');
      assert(state.cardBottom < 659, 'Dialogue overlaps phase map');
      assert.equal(state.speaking, true, 'Speech restarts on each new page');
      textures.add(state.texture);
    }
    assert.equal(textures.size, 5);
    await canvas.screenshot({ path: path.join(output, 'cactario-agua.png') });
    await clickNext();
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('GameScene'));
    const returned = await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('GameScene');
      return { seeds: s.journeyManager.seedCount, next: s.journeyManager.getCurrentStop().sourceStopId };
    });
    assert.equal(returned.seeds, first.seeds + 1);
    assert.equal(returned.next, 'herbarium_rb');
    await page.waitForTimeout(500);
    await canvas.screenshot({ path: path.join(output, 'cactario-saida-herbario.png') });
    // The entire exit viewport must reproduce the original continuous trail,
    // including both sides of the former vertical seam. Sample above the HUD/players.
    const renderedTrail = await page.evaluate(() => new Promise(resolve => {
      const game = window.irmasLaLiGame;
      const scene = game.scene.getScene('GameScene');
      const cactus = scene.worldLayer.stops.find(stop => stop.id === 'cactus_garden');
      const herbarium = scene.journeyManager.getCurrentStop();
      game.renderer.snapshotArea(0, 180, 1280, 140, snapshot => {
        const actualCanvas = document.createElement('canvas');
        actualCanvas.width = 1280;
        actualCanvas.height = 140;
        const actualContext = actualCanvas.getContext('2d');
        actualContext.drawImage(snapshot, 0, 0);
        const actual = actualContext.getImageData(0, 0, 1280, 140).data;
        const expectedContext = document.createElement('canvas').getContext('2d');
        expectedContext.canvas.width = 1280;
        expectedContext.canvas.height = 140;
        expectedContext.drawImage(scene.textures.get('route-chunk-016').getSourceImage(), 0, 180, 1280, 140, 0, 0, 1280, 140);
        const expected = expectedContext.getImageData(0, 0, 1280, 140).data;
        let error = 0;
        for (let i = 0; i < actual.length; i++) error += Math.abs(actual[i] - expected[i]);
        resolve({ meanError: error / actual.length, adjacent: cactus.endX === herbarium.startX,
          hasWalkingSpace: scene.formation.getCenter().x < herbarium.entryX });
      });
    }));
    assert.equal(renderedTrail.adjacent, true);
    assert.equal(renderedTrail.hasWalkingSpace, true);
    assert(renderedTrail.meanError < 2, `Trail differs from continuous painting: ${renderedTrail.meanError}`);
    // Walk to the next stop, verifying that the shorter modules do not skip it.
    await page.keyboard.down('ArrowRight');
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('HerbariumScene'));
    assert.equal(await page.evaluate(() => window.irmasLaLiGame.scene.getScene('CactusGardenScene').isSpeaking), false);
    await page.keyboard.up('ArrowRight');
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('GameScene'));
    // Re-enter using the map and ensure input listeners are not duplicated.
    await page.waitForTimeout(400);
    await clickGame(822, 686);
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('CactusGardenScene') && window.irmasLaLiGame.scene.getScene('CactusGardenScene').ready);
    await page.keyboard.press('Enter');
    await waitPage(1);
    assert.equal((await getState()).index, 1);
    // Leaving by the phase map must work independently of dialogue controls.
    await clickGame(874, 690);
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('HerbariumScene'));
    const seeds = await page.evaluate(() => window.irmasLaLiGame.scene.getScene('HerbariumScene').journeyState.seedCount);
    assert.equal(seeds, first.seeds + 2, 'Only the completed Cactário and Herbário visits grant rewards');
    assert.deepEqual(errors, []);
    console.log('PASS: compact dialogue, capitalization, mouth animation and rest, continuous exit scenery (pixel comparison), walking to Herbarium, 5 backgrounds, manual reading, keyboard/pointer, natural entry, map re-entry/exit, rewards, no runtime/network errors.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
