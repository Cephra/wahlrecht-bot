const fs = require('fs');
const templates = require('../templates.js');

test('displays date correctly', () => {
  const testMessage = {
    "institute": 'InfratestDimap',
    "date": 1630101600,
    "recent": false,
    "predictions": {
      "CDU/CSU": 26,
      "SPD": 24,
      "GRÜNE": 17,
      "FDP": 10,
      "DIE LINKE": 6,
      "AfD": 10
    }
  };
  const expectedMessage = fs
  .readFileSync('./js/tests/expectations/message.txt')
  .toString()

  expect(templates.message(testMessage)).toBe(expectedMessage);
})
