const Handlebars = require('handlebars');
const dayjs = require("dayjs");
Handlebars.registerHelper('date', (timestamp) => {
  return dayjs.unix(timestamp).format('DD.MM.YYYY');
});
const fs = require('fs');

const templatePattern = /(.+?)(?:\.(partial))?\.hbs/;
const templateFiles = fs.readdirSync('./templates');
templates = templateFiles.reduce((acc, filename) => {
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
