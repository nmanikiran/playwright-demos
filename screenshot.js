const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[browserType].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', console.log);
    await page.goto('http://whatsmyuseragent.org/');
    const pageOptions = {
      path: `screenshot/example-${browserType}.png`,
      type: 'png',
      fullPage: true,
    };
    await page.screenshot(pageOptions);
    await browser.close();
  }
})();
