const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// --- SERVER SETUP FOR RENDER ---
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('AI-Trading Core Online'));
app.listen(PORT, () => console.log(`[SYSTEM] Core active on port ${PORT}`));

// --- BOT INITIALIZATION ---
const bot = new Telegraf(process.env.BOT_TOKEN);

// User State Management
const userState = new Map();

// UI Constants for 2026 Theme
const HEADER = "✨ ᴠᴇʟᴏᴄɪᴛʏ ᴀɪ | ɴᴇxᴛ-ɢᴇɴ ᴛʀᴀᴅɪɴɢ ✨";
const DIVIDER = "━━━━━━━━━━━━━━━━━━━━";

// Main Menu Generator
const getMainMenu = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📥 DEPOSIT', 'deposit'), Markup.button.callback('📈 LIVE TRADE', 'trade')],
    [Markup.button.callback('⚡ START / STOP SYSTEM', 'toggle')],
    [Markup.button.callback('💸 WITHDRAW', 'withdraw'), Markup.button.callback('ℹ️ SYSTEM INFO', 'help')]
  ]);
};

// --- HANDLERS ---

bot.start((ctx) => {
  const welcomeMsg = `
${HEADER}
${DIVIDER}
Welcome, **${ctx.from.first_name}**. 
System Status: 🟢 **OPTIMAL**

The Velocity AI Core is ready to process market fluctuations and generate high-frequency returns.

Select a module from the terminal below:
`;
  ctx.replyWithMarkdown(welcomeMsg, getMainMenu());
});

// 1. Advanced Deposit Handler
bot.action('deposit', (ctx) => {
  const wallet = '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  ctx.replyWithMarkdown(`
${HEADER}
${DIVIDER}
🔹 **PERSONAL DEPOSIT GATEWAY**
Address: \`${wallet}\`

⚠️ **NETWORK:** Ethereum (ERC-20)
_Funds will be automatically credited after 2 network confirmations._

[DEMO ONLY - DO NOT SEND REAL ASSETS]
`, getMainMenu());
});

// 2. High-Frequency Trade Simulation
bot.action('trade', (ctx) => {
  ctx.replyWithMarkdown(`
🚀 **AI AGENT DEPLOYED**
${DIVIDER}
Analyzing Order Books...
Matched: **BTC/USDT Long** 🟢
Execution Price: **$104,231.50**

_Maintaining 98.4% Alpha Efficiency..._
`);
});

// 3. System Toggle
bot.action('toggle', (ctx) => {
  const userId = ctx.from.id;
  const isActive = userState.get(userId) || false;
  
  if (!isActive) {
    userState.set(userId, true);
    ctx.replyWithMarkdown("✅ **SYSTEM ENGAGED.** AI is now monitoring liquidity pools.");
  } else {
    userState.set(userId, false);
    ctx.replyWithMarkdown("🛑 **SYSTEM DISENGAGED.** All positions closed.");
  }
});

// 4. Withdrawal with Transaction Link
bot.action('withdraw', (ctx) => {
  ctx.replyWithMarkdown(`
💸 **WITHDRAWAL REQUEST**
${DIVIDER}
Please enter your **BTC/ETH Destination Address** below.
_Current Available Balance: 10.42 ETH_
`);
  userState.set(`${ctx.from.id}_awaiting_withdraw`, true);
});

// Text Handler (Capture address and generate fake txn)
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  if (userState.get(`${userId}_awaiting_withdraw`)) {
    userState.delete(`${userId}_awaiting_withdraw`);
    
    // Generate random Hash and Access Code
    const txnHash = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const accessCode = "VAX-" + Math.floor(Math.random() * 1000000).toString(16).toUpperCase();
    
    ctx.replyWithMarkdown(`
🎉 **SUCCESSFUL DISBURSEMENT**
${DIVIDER}
Amount: **10.00 ETH**
Access Code: \`${accessCode}\`
Status: **BROADCASTING**

🔗 [VIEW ON BLOCKCHAIN](https://www.blockchain.com/explorer/transactions/btc/${txnHash})

_Please allow 10-30 minutes for global sync._
`, getMainMenu());
  }
});

// 5. Help Info
bot.action('help', (ctx) => {
  ctx.replyWithMarkdown(`
${HEADER}
${DIVIDER}
🤖 **CORE VERSION:** v4.2.0 (2026 Build)
🌐 **LATENCY:** 2ms
📊 **ALGORITHM:** Neural-Liquid-v9

_This bot is a tech-demonstration. No real value is processed or stored._
`, getMainMenu());
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
