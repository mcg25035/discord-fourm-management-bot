const guildId = process.env.GUILD_ID;

class Utils {
  constructor(client) {
    this.client = client;
  }

  async muteUser(userId) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const mutedRole = guild.roles.cache.find(role => role.name === 'muted');
      const member = await guild.members.fetch(userId);

      if (mutedRole && member) {
        await member.roles.add(mutedRole);
        console.log(`User ${userId} muted successfully.`);
      } else {
        console.log('Muted role or user not found.');
      }
    } catch (error) {
      console.error('Error muting user:', error);
    }
  }

  async unmuteUser(userId) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      if (!guild) {
        console.log('Guild not found.');
        return;
      }

      const mutedRole = guild.roles.cache.find(role => role.name === 'muted');
      if (!mutedRole) {
        console.log('Muted role not found.');
        return;
      }

      const member = await guild.members.fetch(userId);
      if (!member) {
        console.log('User not found.');
        return;
      }

      await member.roles.remove(mutedRole);
      console.log(`User ${userId} unmuted successfully.`);

    } catch (error) {
      console.error('Error unmuting user:', error);
    }
  }
}

module.exports = Utils;
