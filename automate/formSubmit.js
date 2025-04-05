const { chromium } = require('playwright');
const { faker, fa } = require('@faker-js/faker');

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

  await firstNameHandler.fill(faker.person.firstName(), { delay: 100 });
  await lastNameHandler.fill(faker.person.lastName(), { delay: 100 });
  await emailHandler.fill(faker.internet.email(), { delay: 100 });
  await phoneNumberHandler.fill(faker.phone.number({ style: 'national' }), {
    delay: 100,
  });
  await addressHandler.fill(faker.location.streetAddress(), { delay: 100 });
  await cityHandler.fill(faker.location.city(), { delay: 100 });
  await zipCodeHandler.fill(faker.location.zipCode(), { delay: 100 });

  await page.locator('#button-next-3').click();

  await page.waitForTimeout(1000);
  await page.locator('#book-appointment-submit').click();
  const request = await page.waitForRequest((request) => request);
  const url = request.url();

  const appointmentId = url.split('/').pop();

  console.log('----------------------------------');
  console.log('Appointment created with  id:', appointmentId);
  console.log('----------------------------------');

  await page.waitForTimeout(1000);
  await page.close();
  await browser.close();
})();
