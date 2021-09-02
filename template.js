const Handlebars = require('handlebars');
const fs = require('fs');

let messageTemplate = Handlebars.compile(fs.readFileSync('message.hbs').toString());

module.exports = {
  messageTemplate
};
