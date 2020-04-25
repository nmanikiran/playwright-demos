const { chromium } = require('playwright');

const unusedCss = (stylesheets, ruleUsage) => {
  let usedCSS = 0;
  let totalCSS = 0;
  stylesheets.forEach((stylesheet) => {
    totalCSS += stylesheet.length;
    usedCSS += calcUsedLength(ruleUsage, stylesheet);
  });
  return 100 - Math.round((usedCSS / totalCSS) * 100);
};

const calcUsedLength = (ruleUsage, stylesheet) => {
  const ruleUsages = ruleUsage.filter(
    ({ styleSheetId }) => styleSheetId === stylesheet.styleSheetId,
  );
  return ruleUsages.reduce((sum, x) => sum + x.endOffset - x.startOffset, 0);
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send('DOM.enable');
  await client.send('CSS.enable');
  await client.send('CSS.startRuleUsageTracking');
  await client.send('Performance.enable');

  const stylesheets = [];
  client.on('CSS.styleSheetAdded', (s) => stylesheets.push(s.header));

  await page.goto('https://nmanikiran.github.io/');
  const response = await client.send('Performance.getMetrics');
  const JSUsedSize = response.metrics.find((x) => x.name === 'JSHeapUsedSize')
    .value;
  const JSTotalSize = response.metrics.find((x) => x.name === 'JSHeapTotalSize')
    .value;
  const unusedJS = Math.round((JSUsedSize / JSTotalSize) * 100);
  const perf = await page.evaluate((_) => ({
    firstPaint:
      chrome.loadTimes().firstPaintTime * 1000 -
      performance.timing.navigationStart,
  }));

  const { ruleUsage } = await client.send('CSS.stopRuleUsageTracking');

  const unused = unusedCss(stylesheets, ruleUsage);
  console.log(response);
  console.log(`The page's first paint time is ${perf.firstPaint}ms`);
  console.log(
    `${unused}% of CSS is unused, ${stylesheets.length} total stylesheets`,
  );
  console.log(`${unusedJS}% of JS is unused`);
  await browser.close();
})();
