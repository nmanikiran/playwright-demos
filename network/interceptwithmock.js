const { chromium } = require('playwright');
const mockData = [
  {
    id: 1,
    name: 'Mani Kiran',
    username: 'nmanikiran',
    email: 'nmanikiran@a1labs',
    phone: '1-770-736-8031 x56442',
    website: 'nmanikiran.github.io',
  },
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', console.log);

  // Log and continue all network requests
  await page.route('**/users', (route, request) => {
    console.log(request.method(), request.resourceType(), request.url());
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData),
    });
  });

  await page.goto('https://jsonplaceholder.typicode.com/users');
  // await browser.close();
})();
