const Handlebars = require('handlebars');
const fs = require('fs');

templates = {
  welcome: 'welcome.hbs',
  goodbye: 'goodbye.hbs',
  message: 'message.hbs',
};

Object.keys(templates).reduce((acc, v) => {
  templates[v] = Handlebars.compile(
    fs.readFileSync(`./templates/${templates[v]}`).toString()
  );
  return acc;
}, templates)
console.log('Loaded templates');

module.exports = templates;
