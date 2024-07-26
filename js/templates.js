const Handlebars = require('handlebars');
const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Europe/Berlin');
Handlebars.registerHelper('date', (timestamp) => {
  return dayjs.unix(timestamp).tz().format('DD.MM.YYYY');
});
Handlebars.registerHelper('localize', (text, locale) => {
  return text.toLocaleString(locale);
});
const fs = require('fs');

const templatePattern = /(.+?)(?:\.(partial))?\.hbs/;
const templateFiles = fs.readdirSync('./templates');
let templates = templateFiles.reduce((acc, filename) => {
  const matchedFilename = filename.match(templatePattern);
  const rawTemplate = fs.readFileSync(`./templates/${filename}`).toString();

  if (matchedFilename[2]) {
    Handlebars.registerPartial(matchedFilename[1], rawTemplate);
  } else {
    acc[matchedFilename[1]] = Handlebars.compile(rawTemplate);
  }

  return acc;
}, {});

module.exports = templates;
