const fs = require('fs');

let store = {
  token: 'TOKEN_IN_STORE',
  adminPassword: 'CHANGE_THIS',
  refreshInterval: 900000,
  chats: [],
  admins: [],
  state: null,
};
let loadCallbacks = [];

const storeFile = './store.json';
const readStore = () => {
  fs.readFile(storeFile, (err, data) => {
    if (err) {
      console.log(`Couldn\'t load ${storeFile}`);
      mod.save();
    } else {
      store = {
        ...store,
        ...JSON.parse(data)
      };
      console.log(`Loaded ${storeFile}`);
      console.log('Executing loadCallbacks');
      loadCallbacks.forEach((cb) => cb());
    }
  });
};
const mod = module.exports = {
  save() {
    const serializedStore = JSON.stringify(store, null, 2);
    fs.writeFile('./store.json', serializedStore, (err) => {
      if (err) throw err;
      console.log('Saved store.json');
    });
  },

  onLoad(cb) {
    loadCallbacks.push(cb);
  },

  addChatId(chatId) {
    if (!store.chats.includes(chatId)) {
      store.chats.push(chatId);
    }
    mod.save();
  },
  removeChatId(chatId) {
    store.chats = store.chats.filter(el => el !== chatId);
    mod.save();
  },

  saveNewState(newState) {
    store.state = newState;
    mod.save();
  },

  getState() {
    return store.state;
  },
  getChats() {
    return store.chats;
  },
  getToken() {
    return store.token;
  },
  getRefreshInterval() {
    return store.refreshInterval;
  },

  makeAdmin(chatId, password) {
    if (store.adminPassword === password) {
      store.admins.push(chatId);
      return true;
    } else {
      return false;
    }
  },
  removeAdmin(chatId, password) {
    store.admins = store.admins.filter(el => el !== chatId);
  },
  isAdmin(chatId) {
    return store.admins.includes(chatId);
  }
};
readStore();
