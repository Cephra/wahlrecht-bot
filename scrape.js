#!/usr/bin/node

const bot = require('./bot.js');
const store = require('./store.js');

const axios = require("axios");
const parse = require('./parse.js');


const compare = (newState, oldState) => {
  return newState.filter((v, i) => v.date > oldState[i].date);
};

let state = store.getState();

const reqHandler = (res) => {
  if (state && state.length > 0) {
    // compare states
    console.log('Fetched new state');
    let newState = parse(res.data);
    let comparedState = compare(newState, state);
    if (comparedState.length > 0) {
      console.log('Delta detected');
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

const url = 'https://www.wahlrecht.de/umfragen/';
axios.get(url).then(reqHandler).catch((err) => {
  throw err;
});
const interval = setInterval(() => {
  axios.get(url).then(reqHandler).catch((err) => {
    throw err;
  });
}, 10000);
