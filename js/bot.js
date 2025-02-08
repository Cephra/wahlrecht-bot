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

  bot.onText(/\/stats.*/i, (msg, match) => {
    if (store.isAdmin(msg.chat.id)) {
      bot.sendMessage(msg.chat.id, JSON.stringify({
        chats: store.getChats(),
        admins: store.getAdmins(),
      }, null, 2));
    }
  });

  bot.onText(/\/tell\s([0-9]+)\s([^\s].*)/i, (msg, match) => {
    if (store.isAdmin(msg.chat.id)) {
      bot.sendMessage(match[1], match[2]);
    }
  });

  bot.onText(/\/shout\s(.*)/i, (msg, match) => {
    if (store.isAdmin(msg.chat.id)) {
      store.getChats().forEach((el) => {
        bot.sendMessage(el, match[1]);
      });
    }
  });

  bot.on('polling_error', (error) => {
    console.log(error);
  });
});
module.exports = {
  sendDelta: (delta) => {
    let templatedDeltas = delta.map((deltaEntry) => {
      return templates.message_single(deltaEntry);
    });
    store.getChats().forEach((chatId) => {
      templatedDeltas.forEach((templatedDelta) => {
        bot.sendMessage(chatId, templatedDelta).catch((err) => {
          if (err.body) {
            if (
              403 === err.body.error_code && 
              'Forbidden: bot was blocked by the user' === err.body.description
            ) {
              if (store.isAdmin(chatId)) {
                store.removeAdmin(chatId);
              }
              store.removeChatId(chatId);
            }
          }

          console.log(err);
        });
      });
    });
  },
};
