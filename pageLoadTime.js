const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  // const client = await context.newCDPSession(page);
  // client.send('Network.emulateNetworkConditions', {
  //   offline: false,
  //   latency: 200,
  //   uploadThroughput: (780 * 1024) / 8,
  //   downloadThroughput: (330 * 1024) / 8,
  // });

  const tic = Date.now();
  await page.goto('https://www.applaudsolutions.com/');
  console.log('\n ////////////////////////////////////////////// ');
  console.log(`page load took: ${Date.now() - tic}ms`);
  const pref = await page.evaluate(() => {
    const { loadEventEnd, navigationStart } = performance.timing;
    const firstpaint =
      chrome.loadTimes().firstPaintTime * 1000 - navigationStart;
    return {
      firstpaint,
      loadTime: loadEventEnd - navigationStart,
      loadTimes: JSON.stringify(chrome.loadTimes(), null, 4), // chrome specific
      performance: JSON.stringify(performance.timing, null, 4),
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
