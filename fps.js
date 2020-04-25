const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const client = await context.newCDPSession(page);
  await client.send('Overlay.setShowFPSCounter', { show: true });
  await page.goto('https://fireship.io/');

  // Do graphical regressions here by interacting with the page
  await client.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 100,
    yDistance: -400, // negative to scroll down
    repeatCount: 3,
  });

  await page.screenshot({
    path: 'screenshots/fps.jpeg',
    type: 'jpeg',
    clip: {
      x: 0,
      y: 0,
      width: 370,
      height: 370,
    },
  });
  console.log(
    `Check the screenshot: ${path.join(__dirname, 'screenshots/fps.jpeg')}`,
  );
  await page.close();
  await browser.close();
})();
