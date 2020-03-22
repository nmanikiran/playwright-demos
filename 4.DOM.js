const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);
  try {
    await page.goto('https://github.com/nmanikiran?tab=repositories', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('#user-repositories-list li');

    const repos = await page.evaluate(() => {
      let links = document.querySelectorAll('#user-repositories-list li h3 a');
      return Array.from(links).map(link => ({
        name: link.innerHTML.trim(),
        href: link.href,
      }));
    });

    console.table(repos);
  } catch (error) {
    console.log(error);
  }

  await browser.close();
})();
