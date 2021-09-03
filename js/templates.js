const Handlebars = require('handlebars');
const dayjs = require("dayjs");
Handlebars.registerHelper('date', (timestamp) => {
  return dayjs.unix(timestamp).format('DD.MM.YYYY');
});
const fs = require('fs');

templates = {
  welcome: 'welcome.hbs',
  goodbye: 'goodbye.hbs',
  message: 'message.hbs',
};

Object.keys(templates).reduce((acc, v) => {
  const templateFile = `./templates/${templates[v]}`;
  acc[v] = Handlebars.compile(
    fs.readFileSync(templateFile).toString()
  );
  fs.watchFile(templateFile, () => {
    acc[v] = Handlebars.compile(
      fs.readFileSync(templateFile).toString()
    );
    console.log(`Template ${templateFile} reloaded`);
  });
  return acc;
}, templates)
console.log('Loaded templates');

module.exports = templates;
