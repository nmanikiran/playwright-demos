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
  await page.goto('https://gocovid19.netlify.app/');
  await page.waitForTimeout(1000);
  await page.click(`[href$="/WHO"]`);

  await page.waitForTimeout(1000);
  await page.click(`[href$="/symptoms"]`);

  await page.waitForTimeout(1000);
  await page.click(`[href$="/info"]`);

  await page.waitForTimeout(1000);
  await page.click(`[href$="/faq"]`);

  await page.waitForTimeout(1000);
  // ... perform actions
  await page.close();
  fs.renameSync(await page.video().path(), 'visual-testing.webm');
  await browser.close();
})();
