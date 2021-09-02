const Handlebars = require('handlebars');
const fs = require('fs');

templates = {
  welcomeTemplate: 'welcome.hbs',
  goodbyeTemplate: 'goodbye.hbs',
  messageTemplate: 'message.hbs',
};
Object.keys(templates).reduce((acc, v) => {
  templates[v] = Handlebars.compile(
    fs.readFileSync(`./templates/${templates[v]}`).toString()
  );
  return acc;
}, templates)
module.exports = templates;
