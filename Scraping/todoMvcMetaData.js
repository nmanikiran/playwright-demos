const { chromium } = require('playwright');

const scrapeMetatags = async () => {
  const defaultUrl = 'http://todomvc.com';
  const [, , url = defaultUrl] = process.argv;
  const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  let seoObj;

  if (!isValidUrl) {
    console.error('please pass valid URL as argument');
    return;
  }
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);

  await page.goto(url, {
    waitUntil: 'networkidle',
  });

  try {
    seoObj = await page.evaluate(() => {
      const getMetatag = (name) => {
        const $metaName =
          document.querySelector(`meta[name=${name}]`) ||
          document.querySelector(`meta[name="og:${name}"]`) ||
          document.querySelector(`meta[name="twitter:${name}"]`);
        return $metaName.getAttribute('content');
      };

      return {
        title: document.querySelector('title').innerText,
        favicon: document
          .querySelector('link[rel="shortcut icon"]')
          .getAttribute('href'),
        description: getMetatag('description'),
        // image: getMetatag('image'),
        // author: getMetatag('author'),
      };
    });
  } catch (error) {
    console.log(error);
  }

  console.log(seoObj);
  await browser.close();
};

scrapeMetatags();
