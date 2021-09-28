const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);

  await page.goto('https://uppy.io/examples/xhrupload', {
    waitUntil: 'networkidle',
  });

  const handle = await page.$('#main  div.Uppy input[type="file"]');
  await handle.setInputFiles('./screenshots/example-chromium.png');
  //   await browser.close();
})();
