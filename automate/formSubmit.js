const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setViewportSize({ width: 1000, height: 800 });
  await page.goto('https://demo.easyappointments.org/');
  page.on('pageerror', console.log);
  //  Close model
  await page.waitForSelector(
    'body > div.modal.fade.in.show > div > div > div.modal-footer > button',
  );
  await page.waitForTimeout(1000);
  page.click(
    'body > div.modal.fade.in.show > div > div > div.modal-footer > button',
  );
  await page.waitForTimeout(1000);
  //  let wait to loaded
  await page.selectOption('select#select-service', '1');

  await page.waitForSelector('#button-next-1');
  page.click('#button-next-1');
  //  load page 2
  await page.waitForTimeout(1000);
  const availableHours = await page.$$('#available-hours  span.available-hour');
  if (availableHours.length) {
    page.click('#button-next-2');
  } else {
    // TODO: loop recursively to get day
    const ele = await page.$('.ui-datepicker-today ~ td');
    ele?.click();
    await page.waitForTimeout(500);
    page.click('#button-next-2');
  }

  await page.waitForTimeout(1000);
  const firstNameHandler = await page.$('#first-name');
  const lastNameHandler = await page.$('#last-name');
  const emailHandler = await page.$('#email');
  const phoneNumberHandler = await page.$('#phone-number');
  const addressHandler = await page.$('#address');
  const cityHandler = await page.$('#city');
  const zipCodeHandler = await page.$('#zip-code');

  await firstNameHandler.type('Tom', { delay: 100 });
  await lastNameHandler.type('Cruise', { delay: 100 });
  await emailHandler.type('tom@cruise.com', { delay: 100 });
  await phoneNumberHandler.type('+1-202-555-0153', { delay: 100 });
  await addressHandler.type('New york, USA', { delay: 100 });
  await cityHandler.type('Syracuse', { delay: 100 });
  await zipCodeHandler.type('13202', { delay: 100 });
  page.waitForEvent();
  await page.$('#button-next-3');
  page.click('#button-next-3');

  await page.waitForTimeout(1000);
  await page.$('#book-appointment-submit');

  const [response] = await Promise.all([
    page.waitForNavigation(), // This will set the promise to wait for navigation events
    page.click('#book-appointment-submit'), // After clicking the submit
  ]);

  const resurl = response.request().url();
  var regEx = new RegExp(
    /https:\/\/demo.easyappointments.org\/index.php\/appointments\/book_success\/(\d+)/,
  );
  const result = resurl.match(regEx);
  console.log('----------------------------------');
  console.log('Appointment created with  id:', result[1]);
  console.log('----------------------------------');
  await page.waitForTimeout(1000);
  await page.close();
  await browser.close();
})();
