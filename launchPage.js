const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  page.on('pageerror', console.log);
  await browser.close();
})();
