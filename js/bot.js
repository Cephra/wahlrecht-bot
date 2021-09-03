const fs = require('fs');
const store = require('./store.js');
const templates = require('./templates.js');

const TelegramBot = require('node-telegram-bot-api');
const token = '1981830261:AAGnSN8nyK3TiAcKYLiF6SNCNrPMyCamayE';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start.*/i, (msg, match) => {
  store.addChatId(msg.chat.id);
  bot.sendMessage(msg.chat.id, templates.welcome({
    username: msg.chat.username,
  }));
});

bot.onText(/\/stop.*/i, (msg, match) => {
  store.removeChatId(msg.chat.id);
  bot.sendMessage(msg.chat.id, templates.goodbye());
});

bot.on('polling_error', (error) => {
  console.log(error);
});

const mod = module.exports = {
  sendDelta: (delta) => {
    let templatedDeltas = delta.map((deltaEntry) => {
      return templates.message(deltaEntry);
    });
    store.getChats().forEach((chatId) => {
      templatedDeltas.forEach((templatedDelta) => {
        bot.sendMessage(chatId, templatedDelta);
      });
    });
  },
};
