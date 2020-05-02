const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('https://gocovid19.netlify.app/');
  await page.screenshot({ path: 'screenshots/nojs.png' });

  await browser.close();
})();
