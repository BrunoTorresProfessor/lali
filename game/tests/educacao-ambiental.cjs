const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.SEA_TEST_OUTPUT || path.join(__dirname, '../../output/sea');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1314, height: 754 } });
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(process.env.GAME_URL || 'http://127.0.0.1:8000/');
    await page.waitForFunction(() => window.irmasLaLiGame?.scene.isActive('TitleScene'), null, { timeout: 60000 });
    const canvas = page.locator('canvas');
    async function clickGame(x, y) {
      const box = await canvas.boundingBox();
      await page.mouse.click(box.x + x * box.width / 1280, box.y + y * box.height / 720);
    }
    async function clickNext() {
      const center = await page.evaluate(() => {
        const bounds = window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene').nextButton.getBounds();
        return [bounds.centerX, bounds.centerY];
      });
      await clickGame(...center);
    }
    const waitSea = () => page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('EnvironmentalEducationScene') && window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene').ready);
    const waitPage = index => page.waitForFunction(i => {
      const s = window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene');
      return s.pageIndex === i && !s.isChangingPage;
    }, index);
    await clickGame(640, 616);
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('GameScene'));
    // Start at the actual Herbarium exit and reach SEA by walking.
    const route = await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('GameScene');
      const sea = s.worldLayer.stops.find(stop => stop.id === 'environmental_education');
      const previous = s.worldLayer.stops[sea.stopIndex - 1];
      const resume = s.worldLayer.getResumeCenterX(previous);
      s.journeyManager.currentStopIndex = sea.stopIndex;
      s.journeyManager.seedCount = 3;
      s.formation.setCenter(resume, 590, 'right');
      return { previous: previous.sourceStopId, resume, entry: sea.entryX };
    });
    assert.equal(route.previous, 'herbarium_rb');
    assert(route.resume < route.entry);
    await page.keyboard.down('ArrowRight');
    await waitSea();
    await page.keyboard.up('ArrowRight');
    const info = await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene');
      return { title: s.title, speaker: s.speakerName, pages: s.dialogue.length,
        girls: s.characterEntries.length, markers: s.phaseMap.markers.map(m => [m.x, m.y]),
        speaking: s.isSpeaking, text: s.dialogueText.text,
        narration: s.dialogue.map(page => page.text).join(' ') };
    });
    assert.equal(info.title, 'Serviço de Educação Ambiental');
    assert.equal(info.speaker, 'Lucas');
    assert.equal(info.pages, 4);
    assert.equal(info.girls, 2);
    assert.equal(info.markers.length, 14);
    assert(info.markers.every(p => p.every(Number.isFinite)));
    assert(info.text.startsWith('Olá! Vocês estão no SEA'));
    assert.equal(info.narration, 'Olá! Vocês estão no SEA – nosso Serviço de Educação Ambiental, onde são realizadas várias atividades lúdicas, dinâmicas e informativas de divulgação científica e de educação ambiental. Aqui vocês assistem a vídeos, participam de jogos, pinturas, desenhos e muitas atividades interessantes e investigativas.');
    assert.equal(info.speaking, true);
    const mouths = [];
    const armRotations = [];
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(80);
      mouths.push(await page.evaluate(() => window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene').mouthOpening));
      armRotations.push(await page.evaluate(() => window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene').gesturingArm.rotation));
    }
    assert(Math.max(...mouths) - Math.min(...mouths) > 0.5);
    assert(Math.max(...armRotations) - Math.min(...armRotations) > 0.08);
    await canvas.screenshot({ path: path.join(output, 'sea-boas-vindas.png') });
    await page.waitForFunction(() => window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene').gesturingArm.rotation < -0.20);
    await canvas.screenshot({ path: path.join(output, 'sea-braco-abaixado.png') });
    await page.waitForTimeout(4500);
    assert.equal(await page.evaluate(() => window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene').pageIndex), 0);
    assert.deepEqual(await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene');
      return { arm: s.gesturingArm.visible, patch: s.armBackground.visible, rotation: s.gesturingArm.rotation, stopped: s.armTween === null };
    }), { arm: false, patch: false, rotation: 0, stopped: true });
    await clickNext();
    await waitPage(1);
    await page.keyboard.press('ArrowLeft');
    await waitPage(0);
    for (let index = 1; index < info.pages; index++) {
      await page.keyboard.press('Space');
      await waitPage(index);
      const layout = await page.evaluate(() => {
        const s = window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene');
        return { textBottom: s.dialogueText.y + s.dialogueText.height,
          controls: s.nextButton.y, bottom: s.dialogueContainer.y + s.dialogueHeight, height: s.dialogueHeight };
      });
      assert(layout.textBottom < layout.controls);
      assert(layout.bottom < 659);
      assert(layout.height < 205);
    }
    await canvas.screenshot({ path: path.join(output, 'sea-convite.png') });
    await clickNext();
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('GameScene'));
    const returned = await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('GameScene');
      return { seeds: s.journeyManager.seedCount, next: s.journeyManager.getCurrentStop().sourceStopId,
        center: s.formation.getCenter().x, entry: s.journeyManager.getCurrentStop().entryX };
    });
    assert.equal(returned.seeds, 4);
    assert.equal(returned.next, 'national_school');
    assert(returned.center < returned.entry);
    await page.waitForTimeout(500);
    await canvas.screenshot({ path: path.join(output, 'sea-saida.png') });
    // Direct map entry must start the same visit and keep a single key listener.
    await clickGame(926, 689);
    await waitSea();
    await page.keyboard.press('Enter');
    await waitPage(1);
    assert.equal(await page.evaluate(() => {
      const s = window.irmasLaLiGame.scene.getScene('EnvironmentalEducationScene');
      return s.gesturingArm.visible && s.armTween.isPlaying();
    }), true);
    await clickGame(978, 689);
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('NationalSchoolScene'));
    assert.equal(await page.evaluate(() => window.irmasLaLiGame.scene.getScene('NationalSchoolScene').journeyState.seedCount), 4);
    await page.waitForFunction(() => window.irmasLaLiGame.scene.isActive('CreditsScene'));
    assert.deepEqual(errors, []);
    console.log('PASS: SEA natural entry, Lucas, exact narration, compact layout, mouth and arm movement, idle pose, manual controls, reward, route, map re-entry, next phase and credits, no runtime/network errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
