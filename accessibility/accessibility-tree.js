const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('pageerror', console.log);

  await page.goto('https://gocovid19.netlify.app');

  const snapshot = await page.accessibility.snapshot();
  console.log(snapshot);
  await browser.close();
})();
