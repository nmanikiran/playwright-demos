const { chromium } = require('playwright');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url =
  'https://www.amazon.in/Samsung-Galaxy-Smartphone-Silver-Storage/dp/B0DSKNHX1T/ref=sr_1_2_sspa?crid=3NUWUXU093Z68&dib=eyJ2IjoiMSJ9.ztN6g3YDYf4aNRZ_0Hu4_mCvyYqN88LZ3fvVdXgllBE7eSX1b-Qa0llPC4EtpKamMD6aEALwavo07sYrCf3l2haDxKvsIiHXPDC7m6k2KHrPD6fRXkBIt080Hk1JTPu8ZLvzz7yGBZXL6iMS-L13ZzFpIob8BAM9borvpC7kjH_eqFM22mS5ARg5HLBSM1gTPhSdxAqZCfChk2N_YoVeCkfkNNQPp5PBIayYFzFdE3Q.khd_CuOjEqQzpisuE9X9L1RYsXyx_NQwPRZJcr2LEiA&dib_tag=se&keywords=pixel%2B9&qid=1743852200&sprefix=pixel%2Caps%2C214&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1';
const getCurrentPrice = async (page) => {
  let currentPrice = await page.evaluate(() => {
    const $el = document.querySelector('.a-price-whole');
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
      if (currentPrice < 100000) {
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
