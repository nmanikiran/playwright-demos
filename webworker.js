const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://michaeltreat.github.io/Web-Worker-Demo/html/web-worker.html',
  );
  await page.waitForTimeout(200);
  page.click('#begin');
  await page.waitForTimeout(200);
  page.on('worker', (worker) => {
    console.log('Worker created: ' + worker.url());
    worker.on('close', (worker) =>
      console.log('Worker destroyed: ' + worker.url()),
    );
  });

  console.log('Current workers:');
  for (const worker of page.workers()) console.log('  ' + worker.url());

  await page.close();
  await browser.close();
})();
