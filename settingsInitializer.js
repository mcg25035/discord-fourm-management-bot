const { PermissionFlagsBits } = require('discord.js');

const guildId = process.env.GUILD_ID;

class SettingsInitializer {
  constructor(client) {
    this.client = client;
  }

  async createMutedRole() {
    try {
      const guild = await this.client.guilds.fetch(guildId);

      // Check if the muted role already exists
      let mutedRole = guild.roles.cache.find(role => role.name === 'muted');

      if (!mutedRole) {
        // Create the muted role with specific permissions
        mutedRole = await guild.roles.create({
          name: 'muted',
          permissions: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.UseVAD,
            PermissionFlagsBits.Stream,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.UseExternalEmojis,
            PermissionFlagsBits.UseExternalStickers,
            PermissionFlagsBits.CreateInstantInvite,
            PermissionFlagsBits.ChangeNickname,
          ].filter(p => p !== PermissionFlagsBits.Speak && p !== PermissionFlagsBits.SendMessages && p !== PermissionFlagsBits.AddReactions),
          reason: 'Creating the muted role',
        });

        console.log('Muted role created successfully!');
      } else {
        console.log('Muted role already exists.');
      }

      this.mutedRole = mutedRole; // Store the muted role in the class

      // Optionally set channel overrides to prevent sending messages
      guild.channels.cache.forEach(async (channel) => {
        await channel.permissionOverwrites.create(mutedRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          SPEAK: false
        });
      });

    } catch (error) {
      console.error('Error creating or configuring muted role:', error);
    }
  }
}

module.exports = SettingsInitializer;
