const fs = require('fs');
const store = require('./store.js');

const TelegramBot = require('node-telegram-bot-api');
const token = '1934249310:AAGP9aMYe0xC0I33b6nqk41h_vu1Ul3yfNg';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg, match) => {
  fs.readFile('./welcome.txt', (err, data) => {
    if (err) throw err;
    store.addChatId(msg.chat.id);
    bot.sendMessage(msg.chat.id, data);
  });
});

bot.onText(/\/stop/, (msg, match) => {
  fs.readFile('./goodbye.txt', (err, data) => {
    if (err) throw err;
    store.removeChatId(msg.chat.id);
    bot.sendMessage(msg.chat.id, data);
  });
});

bot.on('polling_error', (error) => {
  console.log(error);
});

module.exports = {
  sendDelta: (delta) => {
  },
};
