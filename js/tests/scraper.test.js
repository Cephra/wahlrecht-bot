const fs = require('fs');
const scraper = require('../scraper.js');

it('scrapes data correctly from website', () => {
  const indexHtml = fs.readFileSync('./js/tests/fixtures/index.html');
  const scraped = scraper.parse(indexHtml);

  expect(scraped[6].predictions['FDP']).toBe(12.5);
});
