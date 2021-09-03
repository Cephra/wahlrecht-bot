const cheerio = require("cheerio");
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

module.exports = {
  parse: (data) => {
    const $ = cheerio.load(data);
    const tableWilko = $('table.wilko');

    const parties = tableWilko.find('tbody > tr:not(#datum):not(#son):not(#erhebung) > th').map((i,el) => {
      return $(el).text();
    }).toArray();

    const institutes = tableWilko.find('thead > tr > th.in').map((i,el) => {
      const cel = $(el);
      cel.find('br').replaceWith(' ');
      return cel.text();
    }).toArray();

    const dates = tableWilko.find('tr#datum td:not(:last-child) > span').map((i, el) => {
      const cel = $(el);

      return {
        value: dayjs(cel.text(), 'DD.MM.YYYY').unix(),
        recent: cel.parent().hasClass('dir'),
      };
    }).toArray();

    return institutes.map((el, ii) => {
      const date = dates[ii]
      const o = {
        institute: el,
        date: date.value,
        recent: date.recent,
        predictions: parties.reduce((acc, el, pi) => {
          acc[el] = parseInt(tableWilko.find(`tbody > tr:nth-child(${2+pi}) > td:nth-child(${3+ii})`).text().replace(' %', '').replace(',', '.'));
          return acc;
        }, {})
      };

      return o;
    });
  },
  compare:  (newState, oldState) => {
    return newState.filter((v, i) => v.date > oldState[i].date);
  }
};
