const { chromium } = require('playwright');
const playwrightVideo = require('playwright-video');
const fs = require('fs');
const { promisify } = require('util');

const artifactsFolder = 'test-output';
const mkdir = promisify(fs.mkdir);

(async () => {
  await mkdir(artifactsFolder, { recursive: true });
  const browser = await chromium.launch();

  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  let capture;

  try {
    await page.goto('https://gocovid19.netlify.app/');
    capture = await playwrightVideo.saveVideo(
      page,
      `${artifactsFolder}/video.mp4`,
    );

    await page.waitForTimeout(1000);
    await page.click(`[href$="/WHO"]`);

    await page.waitForTimeout(1000);
    await page.click(`[href$="/symptoms"]`);

    await page.waitForTimeout(1000);
    await page.click(`[href$="/info"]`);

    await page.waitForTimeout(1000);
    await page.click(`[href$="/faq"]`);

    await page.waitForTimeout(1000);
  } finally {
    await capture.stop();
    await page.close();
    await browser.close();
  }
})();
