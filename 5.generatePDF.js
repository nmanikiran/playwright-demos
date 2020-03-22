const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://javascript.info/generators');
  page.on('pageerror', console.log);

  // https://github.com/microsoft/playwright/blob/master/docs/api.md#pagepdfoptions

  const pagePdfOptions = {
    path: `${process.cwd()}/page.pdf`,
    margin: {
      top: '1in',
      bottom: '1in',
      left: '1in',
      right: '1in',
    },
  };
  await page.emulateMedia({ type: 'print' });
  await page.pdf(pagePdfOptions); // as of now PDF only supports in chromium

  await browser.close();
})();
