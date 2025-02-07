const TelegramBot = require('node-telegram-bot-api');
const store = require('../store');
jest.mock('../store', () => ({
  onLoad: jest.fn((callback) => {
    callback();
  }),
  getToken: jest.fn(() => "BOT_TOKEN"),
  getChats: jest.fn(() => ([
    123, 456
  ])),
}));

beforeEach(() => {
  TelegramBot.mockClear();
});

it('sends the delta to the user', () => {
  const bot = require('../bot.js');

  bot.sendDelta([
    {
      "institute": "Allensbach",
      "date": 1630101600,
      "recent": false,
      "predictions": {
        "CDU/CSU": 26,
        "SPD": 24,
        "GRÜNE": 17.2,
        "FDP": 10,
        "DIE LINKE": 6,
        "AfD": 10
      }
    },
    {
      "institute": "Kantar (Emnid)",
      "date": 1630533600,
      "recent": true,
      "predictions": {
        "CDU/CSU": 21,
        "SPD": 25,
        "GRÜNE": 19,
        "FDP": 11,
        "DIE LINKE": 7.5,
        "AfD": 11
      }
    }
  ]);

  expect(TelegramBot).toHaveBeenCalledTimes(1);
  expect(TelegramBot.mock.instances[0].sendMessage).toHaveBeenCalledTimes(4);
});
