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
  getStore() {
    return store;
  },
  saveNewState(newState) {
    store.state = newState;
    mod.save();
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
