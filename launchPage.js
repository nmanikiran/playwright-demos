const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://whatmyuseragent.com/');
  const useragent = await page.locator('#ua').innerText();
  console.log('=======');
  console.log(useragent);
  console.log('========');
  page.on('pageerror', console.log);
  await browser.close();
})();
