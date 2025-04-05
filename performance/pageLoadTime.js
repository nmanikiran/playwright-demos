const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const tic = Date.now();
  await page.goto('https://github.com/nmanikiran');
  console.log('\n ////////////////////////////////////////////// ');
  console.log(`page load took: ${Date.now() - tic}ms`);
  const pref = await page.evaluate(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const loadEventEnd = navigationEntry.loadEventEnd;
    const navigationStart = navigationEntry.startTime;
    const firstpaint =
      chrome.loadTimes().firstPaintTime * 1000 - navigationStart;
    return {
      firstpaint,
      loadTime: loadEventEnd - navigationStart,
      loadTimes: JSON.stringify(chrome.loadTimes(), null, 4), // chrome specific
      performance: JSON.stringify(navigationEntry, null, 4),
    };
  });
  console.log(`First paint: ${pref.firstpaint}ms`);
  console.log(`page load took (performance): ${pref.loadTime}ms`);
  console.log('\n ////////////////////////////////////////////// \n');
  console.log('------------ chrome load times ------------');
  console.log(pref.loadTimes);
  console.log('------------ performance metrics ------------');
  console.log(pref.performance);
  await browser.close();
})();
