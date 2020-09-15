const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    _videosPath: __dirname, //  save videos here.
    headless: false,
  });
  const context = await browser.newContext({
    _recordVideos: { width: 1024, height: 768 }, // downscale
  });
  const page = await context.newPage();
  const video = await page.waitForEvent('_videostarted');
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
  fs.renameSync(await video.path(), 'video.webm');
  await browser.close();
})();
