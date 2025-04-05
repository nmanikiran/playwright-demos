const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', console.log);
    await page.goto('https://whatmyuseragent.com/');
    const pageOptions = {
      path: `screenshots/example-${browserType}.png`,
      type: 'png',
      fullPage: true,
    };
    await page.screenshot(pageOptions);
    await browser.close();
  }
})();
