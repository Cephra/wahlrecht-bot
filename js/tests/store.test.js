const fs = require('fs');

jest.useFakeTimers();

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
  let adminState;

  adminState = store.makeAdmin(123, 'CHANGE_THIS');
  expect(adminState).toBe(1);

  adminState = store.makeAdmin(456, 'wrong_pass');
  expect(adminState).toBe(0);

  adminState = store.makeAdmin(123, 'CHANGE_THIS');
  expect(adminState).toBe(2);

  store.removeAdmin(456);

  const finalStore = {
    token: 'testtoken',
    adminPassword: 'CHANGE_THIS',
    refreshInterval: 900000,
    chats: [456,789],
    admins: [
      123
    ],
    state: null,
  };

  jest.runAllTimers();

  expect(writeFileMock.mock.calls.length).toBe(1);
  expect(writeFileMock.mock.calls[0][1]).toBe(
    JSON.stringify(finalStore, null, 2)
  );
});
