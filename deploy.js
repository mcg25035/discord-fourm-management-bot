require('dotenv').config();
const { REST, Routes, ApplicationCommandType } = require('discord.js');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [
    {
        name: '檢舉',
        type: ApplicationCommandType.Message,
    },
];

const rest = new REST({ version: '10' }).setToken(token);

async function deployCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { deployCommands };
