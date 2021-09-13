const store = require('./store.js');
const templates = require('./templates.js');

const TelegramBot = require('node-telegram-bot-api');

let bot;
store.onLoad(() => {
  bot = new TelegramBot(store.getToken(), {polling: true});

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

  bot.onText(/\/alle.*/i, (msg, match) => {
    const state = store.getState();
    bot.sendMessage(msg.chat.id, templates.message_all({
      state: state
    }));
  });

  bot.onText(/\/admin\s(.*)/i, (msg, match) => {
    const adminState = store.makeAdmin(msg.chat.id, match[1]);
    bot.sendMessage(msg.chat.id, templates.admin({
      wrongPassword: adminState === 0,
      nowAdmin: adminState === 1,
      alreadyAdmin: adminState === 2,
    }));
  });

  bot.on('polling_error', (error) => {
    console.log(error);
  });
});
module.exports = {
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
