const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const client = await context.newCDPSession(page);
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      // This path must match the WORKSPACE_DIR in Step 1
      downloadPath: './',
    });
    await page.evaluate(() => {
      const rows = [
        ['name1', 'city1', 'some other info'],
        ['name2', 'city2', 'more info'],
      ];
      let csvContent = 'data:text/csv;charset=utf-8,';
      rows.forEach(function (rowArray) {
        let row = rowArray.join(',');
        csvContent += row + '\r\n';
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);

      return link.click();
    });
    await page.waitForTimeout(1000);
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
