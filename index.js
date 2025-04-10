require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, () => {
  console.log('Bot is ready!');
});

client.login(token);
