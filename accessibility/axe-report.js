const { chromium } = require('playwright');
const axe = require('axe-core');
const fs = require('fs');

let axeResults;
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://gocovid19.netlify.app/');
  // add axe-core to the pages
  await page.addScriptTag({
    path: require.resolve('axe-core'),
  });

  // run axe on the page
  axeResults = await page.evaluate(async () => {
    return await axe.run();
  });

  // add results to the collection of axe results
  if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets');
    fs.writeFileSync('./assets/axe.json', JSON.stringify(axeResults, null, 4));
  } else {
    fs.writeFileSync('./assets/axe.json', JSON.stringify(axeResults, null, 4));
  }
  console.log(`Check axe.json, logged all the accessibility violations.`);
  await browser.close();
})();
