const process = require('process');
const fs = require('fs');

let store = {
  chats: [],
  state: null,
};
let loadCallbacks = [];

const mod = module.exports = {
  save() {
    const serializedStore = JSON.stringify(store, null, 2);
    fs.writeFile('./store.json', serializedStore, (err) => {
      if (err) throw err;
    });
  },
  onLoad(cb) {
    loadCallbacks.push(cb);
  },
  addChatId(chatId) {
    if (!chatId.includes(chatId)) {
      store.chats.push(chatId);
    }
  },
  removeChatId(chatId) {
    store.chats = store.filter(el => el !== chatId);
  },
  getStore() {
    return store;
  },
  saveNewState(newState) {
    store.state = newState;
  },
  getState() {
    return store.state;
  },
};

// read store on first open
fs.readFile('./store.json', (err, data) => {
  if (err) {
    console.log('Couldn\'t load ./store.json');
  } else {
    store = JSON.parse(data);
    console.log('Loaded ./store.json');
    console.log('Executing loadCallbacks');
    loadCallbacks.forEach((cb) => cb());
  }
});
