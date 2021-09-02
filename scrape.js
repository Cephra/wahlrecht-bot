#!/usr/bin/node

const bot = require('./bot.js');

const store = require('./store.js');

const parse = require('./parse.js');

const compare = (newState, oldState) => {
  return newState.filter((v, i) => v.date > oldState[i].date);
};

let state;
const reqHandler = (res) => {
  if (state && state.length > 0) {
    // compare states
    console.log('Fetched new state');
    let newState = parse(res.data);
    let comparedState = compare(newState, state);
    if (comparedState.length > 0) {
      console.log('Delta detected');
      console.log(comparedState);
      store.saveNewState(newState);
      state = store.getState();
      // handle delta
    }
  } else {
    // set initial state
    console.log('Setting initial state');
    state = parse(res.data);
  }
};
store.onLoad(() => {
  state = store.getState();

  const url = 'https://www.wahlrecht.de/umfragen/';

  const axios = require("axios");
  axios.get(url).then(reqHandler).catch((err) => {
    throw err;
  });
  const interval = setInterval(() => {
    axios.get(url).then(reqHandler).catch((err) => {
      throw err;
    });
  }, 300000);
});
