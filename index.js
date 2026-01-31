const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// Initialize Express for Render.com's port requirement
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize Bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Simple in-memory state for demonstration
// In a real app, use a database
const userState = new Map();

// Main Menu Keyboard
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback('💰 Deposit', 'deposit'), Markup.button.callback('📈 Trade', 'trade')],
  [Markup.button.callback('⏯ Start / Stop', 'toggle')],
  [Markup.button.callback('💸 Withdraw', 'withdraw'), Markup.button.callback('❓ Help', 'help')]
]);

// Start Command
bot.start((ctx) => {
  ctx.reply(
    'Welcome to the Demo Trading Bot! 🚀\nChoose an option below to begin.',
    mainMenu
  );
});

// 1. Deposit Handler
bot.action('deposit', (ctx) => {
  const randomAddress = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  ctx.reply(`📥 Deposit ETH here:\n\`${randomAddress}\`\n\n(Demo purposes only - do not send real funds!)`, { parse_mode: 'MarkdownV2' });
});

// 2. Trade Handler
bot.action('trade', (ctx) => {
  ctx.reply('Hurry! I am entering the ETH market now to make profits for you 🚀');
});

// 3. Start/Stop Toggle Handler
bot.action('toggle', (ctx) => {
  const userId = ctx.from.id;
  const isTrading = userState.get(userId) || false;
  
  if (!isTrading) {
    userState.set(userId, true);
    ctx.reply('✅ Trading started successfully.');
  } else {
    userState.set(userId, false);
    ctx.reply('🛑 Trading stopped.');
  }
});

// 4. Withdraw Handler
bot.action('withdraw', (ctx) => {
  ctx.reply('Please enter your Ethereum address to receive your profits:');
  // Set a flag so the next text message is treated as an address
  userState.set(`${ctx.from.id}_awaiting_withdraw`, true);
});

// 5. Help Handler
bot.action('help', (ctx) => {
  ctx.reply(
    '📖 *Help & Info*\n\n' +
    'This is a **DEMO** trading bot.\n\n' +
    '• No real funds are involved.\n' +
    '• All balances and profits are simulated.\n' +
    '• This bot is for educational/demonstration purposes only.',
    { parse_mode: 'Markdown' }
  );
});

// Text Message Handler (for Withdrawal address)
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  if (userState.get(`${userId}_awaiting_withdraw`)) {
    userState.delete(`${userId}_awaiting_withdraw`);
    ctx.reply(`Congratulations 🎉 10 ETH profit is on its way to your address: ${ctx.message.text}`);
  } else {
    ctx.reply('Use the menu to interact with the bot:', mainMenu);
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// Launch Bot
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
