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
    await page.waitForSelector('#main div.lister .lister-list');

    const movies = await page.evaluate(() => {
      let list = document.querySelectorAll('#main div.lister .lister-list tr');
      return Array.from(list).map((link) => ({
        name: link.querySelector('.titleColumn a').innerHTML.trim(),
        poster: link.querySelector('.posterColumn img').src,
        rating: Number(
          link.querySelector('.imdbRating strong').innerHTML.trim(),
        ),
      }));
    });

    console.table(movies);
  } catch (error) {
    console.log(error);
  }

  await browser.close();
})();
