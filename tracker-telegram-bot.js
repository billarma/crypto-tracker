const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from the BotFather
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: false });

const originalConsoleLog = console.log;

console.log = function (message) {
  originalConsoleLog.apply(console, arguments);
  bot.sendMessage('YOUR_CHAT_ID', message.toString());
};