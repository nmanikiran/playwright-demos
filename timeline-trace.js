const { chromium } = require('playwright');

// Timeline viewer: https://chromedevtools.github.io/timeline-viewer/

(async () => {
  const browser = await chromium.launch({});

  const page = await browser.newPage();

  await browser.startTracing(page, { path: 'trace.json' });
  await page.goto('https://www.google.com');
  await browser.stopTracing();

  await page.close();
  await browser.close();
})();
