const { webkit, devices } = require('playwright');
const iPhone11 = devices['iPhone 11 Pro'];

(async () => {
  const browser = await webkit.launch({ headless: false });
  try {
    const context = await browser.newContext({
      ...iPhone11,
      geolocation: { longitude: 78.2679616, latitude: 17.4126274 },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();
    page.on('pageerror', console.log);
    await page.goto('https://maps.google.com');
    await page.click('text="Your location"');
    await page.waitForRequest(/.*preview\/pwa/);
    await page.screenshot({ path: 'screenshots/colosseum-iphone.png' });
  } catch (error) {
    console.log(error);
  }
  await browser.close();
})();
