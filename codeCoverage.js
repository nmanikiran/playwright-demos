const { chromium } = require('playwright');
const v8toIstanbul = require('v8-to-istanbul');
const { promisify } = require('util');
const fs = require('fs');
const fsWriteFile = promisify(fs.writeFile);

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
    fsWriteFile('./coverage/js.json', JSON.stringify(data, null, 2), 'utf8');
  }
  await browser.close();
})();
