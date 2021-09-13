const TelegramBot = require('node-telegram-bot-api');
const store = require('../store.js');
const templates = require('../templates.js');
const bot = require('../bot.js');
jest.mock('node-telegram-bot-api');
jest.mock('../store.js');
jest.mock('../templates.js');

jest.useFakeTimers();

beforeEach(() => {
  TelegramBot.mockClear();
});

it('sends the delta to the user', () => {
  jest.runAllTimers();
});
