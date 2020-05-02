// source : https://nitayneeman.com/posts/getting-to-know-puppeteer-using-practical-examples/#handling-events

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Emitted when the DOM is parsed and ready (without waiting for resources)
  page.once('domcontentloaded', () => console.info('✅ DOM is ready'));

  // Emitted when the page is fully loaded
  page.once('load', () => console.info('✅ Page is loaded'));

  // Emitted when the page attaches a frame
  page.on('frameattached', () => console.info('✅ Frame is attached'));

  // Emitted when a frame within the page is navigated to a new URL
  page.on('framenavigated', () => console.info('👉 Frame is navigated'));

  // Emitted when a script within the page uses `console.timeStamp`
  page.on('metrics', (data) =>
    console.info(`👉 Timestamp added at ${data.metrics.Timestamp}`),
  );

  // Emitted when a script within the page uses `console`
  page.on('console', (message) =>
    console[message.type()](`👉 ${message.text()}`),
  );

  // Emitted when the page emits an error event (for example, the page crashes)
  page.on('error', (error) => console.error(`❌ ${error}`));

  // Emitted when a script within the page has uncaught exception
  page.on('pageerror', (error) => console.error(`❌ ${error}`));

  // Emitted when a script within the page uses `alert`, `prompt`, `confirm` or `beforeunload`
  page.on('dialog', async (dialog) => {
    console.info(`👉 ${dialog.message()}`);
    await dialog.dismiss();
  });

  // Emitted when a new page, that belongs to the browser context, is opened
  page.on('popup', () => console.info('👉 New page is opened'));

  // Emitted when the page produces a request
  page.on('request', (request) => console.info(`👉 Request: ${request.url()}`));

  // Emitted when a request, which is produced by the page, fails
  page.on('requestfailed', (request) =>
    console.info(`❌ Failed request: ${request.url()}`),
  );

  // Emitted when a request, which is produced by the page, finishes successfully
  page.on('requestfinished', (request) =>
    console.info(`👉 Finished request: ${request.url()}`),
  );

  // Emitted when a response is received
  page.on('response', (response) =>
    console.info(`👉 Response: ${response.url()}`),
  );

  // Emitted when the page creates a dedicated WebWorker
  page.on('workercreated', (worker) =>
    console.info(`👉 Worker: ${worker.url()}`),
  );

  // Emitted when the page destroys a dedicated WebWorker
  page.on('workerdestroyed', (worker) =>
    console.info(`👉 Destroyed worker: ${worker.url()}`),
  );

  // Emitted when the page detaches a frame
  page.on('framedetached', () => console.info('✅ Frame is detached'));

  // Emitted after the page is closed
  page.once('close', () => console.info('✅ Page is closed'));

  await page.goto('https://nmanikiran.github.io/');

  await browser.close();
})();
