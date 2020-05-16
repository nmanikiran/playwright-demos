const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);

  // Log and continue all network requests
  await page.route('**', (route, request) => {
    console.log(request.method(), request.resourceType(), request.url());
    route.continue();
  });

  await page.goto('https://playwright.dev/');
  await browser.close();
})();
