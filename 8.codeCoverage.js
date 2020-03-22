const { chromium } = require('playwright');
const v8toIstanbul = require('v8-to-istanbul');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', console.log);

  await page.coverage.startJSCoverage();
  await page.goto('https://chromium.org');
  const coverage = await page.coverage.stopJSCoverage();
  for (const entry of coverage) {
    const converter = new v8toIstanbul('', 0, { source: entry.source });
    await converter.load();
    converter.applyCoverage(entry.functions);
    const data = converter.toIstanbul();
    // console.log(JSON.stringify(data), typeof data);
    fs.writeFileSync('./coverage/js.json', JSON.stringify(data));
  }
  await browser.close();
})();
