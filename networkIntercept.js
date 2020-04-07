const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);

  // Log and continue all network requests
  page.route('**', (route) => {
    console.log(route.resourceType(), route.url());
    route.continue();
  });

  await page.goto('http://todomvc.com');
  await browser.close();
})();
