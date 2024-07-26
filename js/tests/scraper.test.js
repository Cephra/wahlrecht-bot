const fs = require('fs');
const scraper = require('../scraper.js');

it('scrapes data correctly from website', () => {
  const indexHtml = fs.readFileSync('./js/tests/fixtures/index.html');
  const scraped = scraper.parse(indexHtml);

  expect(scraped[0].predictions['GRÜNE']).toBe(11.5);
});
