const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

   const client = await context.newCDPSession(page);
  await client.send('Animation.enable');
  client.on('Animation.animationCreated', () =>
    console.log('Animation created!'),
  );
  const response = await client.send('Animation.getPlaybackRate');
  console.log('playback rate is ' + response.playbackRate);
  await client.send('Animation.setPlaybackRate', {
    playbackRate: response.playbackRate / 2,
  });
  await page.close();
  await browser.close();
})();
