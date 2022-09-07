const fs = require('fs');
const templates = require('../templates.js');

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  watchFile: jest.fn()
}));

it('displays date correctly', () => {
  const testMessage = {
    "institute": 'InfratestDimap',
    "date": 1630101600,
    "recent": false,
    "predictions": {
      "CDU/CSU": 26.2,
      "SPD": 24,
      "GRÜNE": 17.4,
      "FDP": 10,
      "DIE LINKE": 6.3,
      "AfD": 10
    }
  };
  const expectedMessage = fs
  .readFileSync('./js/tests/expectations/message.txt')
  .toString()

  expect(templates.message_single(testMessage)).toBe(expectedMessage);
});

it('shows no user when it is not set', () => {
  const expectedMessage = fs
  .readFileSync('./js/tests/expectations/welcome_no_user.txt')
  .toString()
  expect(templates.welcome(null)).toBe(expectedMessage);
});

it('shows user when it is set', () => {
  const expectedMessage = fs
  .readFileSync('./js/tests/expectations/welcome_user.txt')
  .toString()
  expect(templates.welcome({
    username: 'Username'
  })).toBe(expectedMessage);
});
