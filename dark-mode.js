const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html',
  );
  await page.emulateMedia({ colorScheme: 'light' });

  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'screenshots/light.jpg',
    type: 'jpeg',
    omitBackground: true,
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForTimeout(200);
  await page.screenshot({
    path: 'screenshots/dark.jpg',
    type: 'jpeg',
    omitBackground: true,
  });
  console.log('check screenshots folder');
  await browser.close();
})();
