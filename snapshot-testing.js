const fs = require('fs');
const { promisify } = require('util');
const { chromium } = require('playwright');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const config = {
  viewport: {
    width: 1920,
    height: 1080,
  },
};

const fsStat = promisify(fs.stat);
const fsCopyFile = promisify(fs.copyFile);

const imageFromFile = (filename) =>
  new Promise((resolve) => {
    const img = fs
      .createReadStream(filename)
      .pipe(new PNG())
      .on('parsed', () => {
        resolve(img.data);
      });
  });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ ...config.viewport });

  await page.goto('https://fireship.io/');
  await page.waitForTimeout(2000);

  // capture the screenshot
  await page.screenshot({ path: 'new_layout.png' });

  const oldFile = await fsStat('old_layout.png').catch(() => undefined);
  if (!oldFile) {
    console.log('no old layout, exiting');
    await fsCopyFile('new_layout.png', 'old_layout.png');
    await browser.close();
    return;
  }

  const newLayout = await imageFromFile('new_layout.png');
  const oldLayout = await imageFromFile('old_layout.png');
  const diff = new PNG(config.viewport);
  const diffPixels = pixelmatch(
    newLayout,
    oldLayout,
    diff.data,
    config.viewport.width,
    config.viewport.height,
    {
      threshold: 0,
    },
  );

  if (diffPixels === 0) {
    console.log('Success! No difference in rendering');
  } else {
    console.log(
      `Uh-oh! There are ${diffPixels} different pixels in new render!`,
    );
  }
  await browser.close();
})();
