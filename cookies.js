const { chromium, firefox } = require('playwright');

const getCookies = async () => {
  const browser = await firefox.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);

  await page.goto('https://demo.easyappointments.org/index.php/backend/', {
    waitUntil: 'networkidle',
  });

  await page.waitForTimeout(1000);
  await page.$('#login');
  page.click('#login');
  await page.waitForTimeout(1000);
  const cookies = await context.cookies();

  return cookies;
};

(async () => {
  const cookies = await getCookies();
  const left = 600;

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized', `--window-position=${left},0`],
  });
  const context = await browser.newContext();
  await context.addCookies(cookies);
  const page = await context.newPage();
  page.on('pageerror', console.log);

  await page.goto('https://demo.easyappointments.org/index.php/backend/', {
    waitUntil: 'networkidle',
  });

  //await browser.close();
})();
