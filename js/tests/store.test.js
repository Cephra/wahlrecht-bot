const fs = require('fs');

const mockStore = {
  token: 'testtoken',
  refreshInterval: 900000,
  chats: [123,456],
  state: null,
};

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFile: jest.fn((filename, callback) => {
    callback(null, JSON.stringify(mockStore, null, 2));
  }),
}));

it('reads the store.json', () => {
  const store = require('../store.js');

  store.onLoad(() => {
    expect(store.getToken()).toBe('testtoken');
    expect(store.getRefreshInterval()).toBe(900000);
    expect(store.getChats()).toBe([
      123, 456
    ]);
  });
});

it('saves on changes', () => {
  const store = require('../store.js');

  const writeFileMock = fs.writeFile = jest.fn((filename, data, callback) => {
    callback(null);
  });

  store.addChatId(789);
  store.removeChatId(123);

  const firstStore = {
    token: 'testtoken',
    refreshInterval: 900000,
    chats: [123,456,789],
    state: null,
  };
  const secondStore = {
    token: 'testtoken',
    refreshInterval: 900000,
    chats: [456,789],
    state: null,
  };

  expect(writeFileMock.mock.calls.length).toBe(2);
  expect(writeFileMock.mock.calls[0][1]).toBe(
    JSON.stringify(firstStore, null, 2)
  );
  expect(writeFileMock.mock.calls[1][1]).toBe(
    JSON.stringify(secondStore, null, 2)
  );
});
