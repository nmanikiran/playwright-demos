const { chromium } = require('playwright');
const lighthouse = require('lighthouse');

(async () => {
  const url = 'https://fireship.io/';
  const browserServer = await chromium.launchServer();
  const wsEndpoint = browserServer.wsEndpoint();
  // Use web socket endpoint later to establish a connection.
  const browser = await chromium.connect({ wsEndpoint });
  // console.log(wsEndpoint);
  const { lhr } = await lighthouse(url, {
    port: new URL(wsEndpoint).port,
    output: 'json',
    logLevel: 'info',
  });
  const scores = Object.keys(lhr.categories).map((c) => {
    const categorey = lhr.categories[c];
    const { title, id, score } = categorey;
    return {
      title,
      id,
      score: score * 100,
      audits: categorey.auditRefs.length,
    };
  });
  console.table(scores);

  await browserServer.close();
  await browser.close();
})();
