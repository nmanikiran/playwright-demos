const { firefox } = require('playwright'); // Or 'chromium' or 'webkit'.

// it will list number frames in the webpage
(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto('https://codepen.io/nmanikiran/full/JjdwbqP');
  dumpFrameTree(page.mainFrame(), ' ');
  await browser.close();

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (const child of frame.childFrames()) {
      dumpFrameTree(child, indent + '  ');
    }
  }
})();
