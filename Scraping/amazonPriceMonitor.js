const { chromium } = require('playwright');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url =
  'https://www.amazon.com/TP-Link-AC1750-Smart-WiFi-Router/dp/B079JD7F7G/ref=sr_1_5?crid=2JDZXNQPT05L9';

const getCurrentPrice = async (page) => {
  await page.reload();
  let currentPrice = await page.evaluate(() => {
    const $el = document.querySelector('#priceblock_ourprice');
    const dollarPrice = $el ? $el.innerText : 0;
    return Number(dollarPrice.replace(/[^0-9.-]+/g, ''));
  });
  return currentPrice;
};

const sendNotification = async (price) => {
  const { USER_EMAIL, GAMIL_PASSWORD, TO_EMAIL } = process.env;
  if (![USER_EMAIL, GAMIL_PASSWORD, TO_EMAIL].every((e) => !!e)) {
    console.log('Required Credentials :(((');
    return false;
  }
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER_EMAIL,
      pass: GAMIL_PASSWORD,
    },
  });

  let textToSend = 'Price dropped to ' + price;
  let htmlText = `your item price is dropped you can check <a href=\"${url}\">here</a>`;

  let info = await transporter.sendMail({
    from: `Price Tracker ${USER_EMAIL}`,
    to: TO_EMAIL,
    subject: 'Price dropped to ' + price,
    text: textToSend,
    html: htmlText,
  });
  console.log('Message sent: %s', info.messageId);
  return info;
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  const job = new CronJob(
    '* */30 * * * *',
    async () => {
      //runs every 30 minutes in this config
      const currentPrice = await getCurrentPrice(page);
      if (currentPrice < 59) {
        console.log('BUY!!!! ' + currentPrice);
        const result = await sendNotification(currentPrice);
        if (result) job.stop();
      }
    },
    null,
    true, // start
    null, // timeZone
    null,
    true, // runOnInit
  );
  job.start();
})();
