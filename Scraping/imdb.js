const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);
  try {
    await page.goto('https://www.imdb.com/chart/top/?sort=rk,asc&mode=simple', {
      waitUntil: 'networkidle',
    });
    await page.waitForSelector('main .ipc-page-grid .ipc-metadata-list');

    const movies = await page.evaluate(() => {
      let list = document.querySelectorAll(
        'main .ipc-page-grid .ipc-metadata-list li',
      );
      return Array.from(list).map((link) => ({
        poster: link.querySelector('.cli-poster-container img').src,
        name: link.querySelector('.cli-children a').innerText.trim(),
        rating: Number(
          link
            .querySelector(
              '.cli-children .ipc-rating-star .ipc-rating-star--rating',
            )
            .innerText.trim(),
        ),
      }));
    });

    console.table(movies);
  } catch (error) {
    console.log(error);
  }

  await browser.close();
})();
