const nodeTelegramBotApi = jest.createMockFromModule('node-telegram-bot-api');

nodeTelegramBotApi.prototype.sendMessage = jest.fn().mockResolvedValue({});

module.exports = nodeTelegramBotApi;