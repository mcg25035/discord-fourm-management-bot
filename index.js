require('dotenv').config();
const { Client, Events, GatewayIntentBits, MessageFlags, GuildMessageManager, Message } = require('discord.js');
const SettingsInitializer = require('./settingsInitializer');
const Utils = require('./utils');
const { deployCommands } = require('./deploy');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = process.env.BOT_TOKEN;

async function main() {
    await deployCommands();
    const client = new Client(
        {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        }
    );

    client.on(Events.ClientReady, async () => {
        console.log('Bot is ready!');
    });

    client.on(Events.InteractionCreate, async interaction => {
        
        if (!interaction.isMessageContextMenuCommand()) return;

        if (interaction.commandName === '檢舉') {
            let targetThread = await client.channels.fetch(interaction.targetMessage.channelId);

            if (targetThread && !targetThread.isThread()) {
                interaction.targetMessage.delete();
                return;
            }

            /** @type {null | Message} */
            let starterMessage;
            try{
                starterMessage = await targetThread.fetchStarterMessage();
                if (!starterMessage) throw new Error('Starter message not found');
            }
            catch (error) {
                console.error('討論串起始訊息已經刪除或無法獲取:', error);
            }

            if (starterMessage && starterMessage.id === interaction.targetMessage.id) {
                targetThread.delete();
            }
            else {
                interaction.targetMessage.delete();
            }
            
            
            
            // await interaction.reply({ content: '請前往 [這裡](http://shwoo_gov.mcloudtw.com/51121.html) 填寫表單，完成檢舉。' , flags: MessageFlags.Ephemeral});
        }
    });

    const utils = new Utils(client);

    client.on(Events.MessageCreate, async message => {
        if (message.content.startsWith('!mute')) {
            const userId = message.content.split(' ')[1];
            if (userId) {
                await utils.muteUser(userId);
            } else {
                message.reply('Please provide a user ID to mute.');
            }
        } else if (message.content.startsWith('!unmute')) {
            const userId = message.content.split(' ')[1];
            if (userId) {
                await utils.unmuteUser(userId);
            } else {
                message.reply('Please provide a user ID to unmute.');
            }
        }
    });

    client.login(token);
    const settingsInitializer = new SettingsInitializer(client);
    settingsInitializer.createMutedRole();
}

main();
