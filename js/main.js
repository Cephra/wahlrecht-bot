#!/usr/bin/node

const bot = require('./bot.js');
const store = require('./store.js');
const scraper = require('./scraper.js');
const axios = require("axios");

let state;
const reqHandler = (res) => {
  if (state && state.length > 0) {
    // compare states
    console.log('Fetched new state');
    let newState = scraper.parse(res.data);
    let comparedState = scraper.compare(newState, state);
    if (comparedState.length > 0) {
      console.log('Delta detected');
      store.saveNewState(newState);
      state = store.getState();
      bot.sendDelta(comparedState);
    }
  } else {
    // set initial state
    console.log('Setting initial state');
    state = scraper.parse(res.data);
  }
};
store.onLoad(() => {
  state = store.getState();

  const url = 'https://www.wahlrecht.de/umfragen/';

  axios.get(url).then(reqHandler).catch((err) => {
    throw err;
  });
  const interval = setInterval(() => {
    axios.get(url).then(reqHandler).catch((err) => {
      throw err;
    });
  }, store.getRefreshInterval());
});
