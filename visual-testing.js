const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext({
    videosPath: __dirname, //  save videos here.
    videoSize: { width: 1024, height: 768 }, // downscale
  });
  const page = await context.newPage();
  await page.goto('https://fireship.io');
  await page.waitForTimeout(1000);
  await page.click(`[href$="/pro"]`);

  await page.waitForTimeout(1000);
  await page.click(`[href$="/lessons"]`);

  await page.waitForTimeout(1000);
  await page.click(`[href$="/courses"]`);

  await page.waitForTimeout(1000);
  await page.click(`[href$="/snippets"]`);
  await page.waitForTimeout(1000);
  await page.click(`[href$="/tags"]`);

  await page.waitForTimeout(1000);
  // ... perform actions
  await page.close();
  fs.renameSync(await page.video().path(), './assets/visual-testing.webm');
  await browser.close();
})();
