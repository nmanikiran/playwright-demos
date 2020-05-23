const { chromium } = require('playwright');
const fs = require('fs');

const scrapeInfiniteScrollItems = async (
  page,
  itemTargetCount,
  scrollDelay = 1000,
) => {
  let items = [];
  try {
    while (items.length < itemTargetCount) {
      items = await page.evaluate(() => {
        const extractedElements = document.querySelectorAll(
          '[data-qa-id="doctor_listing_cards"]  div.listing-doctor-card',
        );
        if (document.querySelector('.error--content')) {
          console.log('Error: while get data');
          return;
        }
        return Array.from(extractedElements).map((el) => ({
          name: el.querySelector('.doctor-name').innerText,
          specialisation: el.querySelector(
            '[data-qa-id="doctor_specialisation"]',
          ).innerText,
          experience: el.querySelector('[data-qa-id="doctor_experience"]')
            .innerText,
          city: el.querySelector('[data-qa-id="practice_city"]').innerText,
          clinic_name: el.querySelector('[data-qa-id="doctor_clinic_name"]')
            .innerText,
          consultation_fee: el.querySelector('[data-qa-id="consultation_fee"]')
            .innerText,
        }));
      });
      const random = Math.random();
      const divBy = random > 0.5 && random < 0.9 ? random : 0.75;
      await page.evaluate(
        `window.scrollTo({top: (document.body.scrollHeight * ${divBy}), behavior: "smooth"})`,
      );
      await page.waitForTimeout(scrollDelay);
    }
  } catch (e) {
    console.log('ERROR');
    console.error(e);
  }
  return items;
};

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 926 });

  await page.goto('https://www.practo.com/Bangalore/doctors');

  const items = (await scrapeInfiniteScrollItems(page, 100)) || [];

  // Save extracted items to a file.
  console.log(`Check items.json, Scrapped ${items.length} items.`);
  fs.writeFileSync('./items.json', JSON.stringify(items, null, 4));

  await page.close();
  await browser.close();
})();
