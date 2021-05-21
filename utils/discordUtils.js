/**
 * Get avatars from a message
 * 
 * @param {Object} message discord message object
 * @param {Object} client discord client object
 * 
 * @returns {Object} Object representing avatars for users
 */
const getAvatars = (message, client) => {
  let users = message.mentions.users.map((u) => {
    return u;
  });
  let avatars = {};
  if (users.length) {
    avatars.self = message.author.avatarURL({ format: 'png' });
    avatars.target = users[0].avatarURL({ format: 'png' });
  } else {
    avatars.self = client.user.avatarURL({ format: 'png' });
    avatars.target = message.author.avatarURL({ format: 'png' });
  }
  return avatars;
}

/**
 * Get usernames from a message
 * 
 * @param {Object} message discord message object
 * 
 * @returns {Object} Object representing usernames for users
 */
const getUsernames = (message) => {
  let users = message.mentions.users.map((u) => {
    return u;
  });
  const usernames = {};
  usernames.self = message.author.username;
  usernames.target = users.length ? users[0].username : null;
  return usernames;
}

/**
 * Deletes messages from a given channel
 * 
 * @param {Discord.client} client discord client
 * @param {Number} channelId channelId
 * @param {Number} limit number of messages to delete (max 100)
 */
const deleteMessages = async (client, channelId, limit) => {
  try {
    const channel = client.channels.cache.get(channelId);
    const recentMessages = await channel.messages.fetch({ limit: limit + 1 });
    channel.bulkDelete(recentMessages).catch(error => console.log(`Couldn't delete messages because of: ${error}`));
  } catch (err) {
    console.log(`Error in <deleteMessages>: channelId - ${channelId}\nMessage: ${err}`);
  }
}

/**
 * 
 * @param {Discord.client} client discord client
 * @param {string} serverId id of the discord server
 * @returns {Object} object representing text channels and their ids
 */
const getTextChannelIDs = (client, serverId) => {
  const channels = client.guilds.cache.get(serverId).channels.cache.sort((a, b) => {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  }).filter(c => {
    return c.type === 'text';
  }).map(c => {
    return {
      name: c.name,
      id: c.id
    }
  });
  return channels;
}

/**
 * 
 * @param {Discord.client} client discord client
 * @param {string} serverId id of the discord server
 * @returns {Object} object representing text channels and their ids
 */
const getTextChannels = (client, serverId) => {
  const channels = client.guilds.cache.get(serverId).channels.cache.sort((a, b) => {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  }).filter(c => {
    return c.type === 'text';
  });
  return channels;
}

const getMessagesFromGuildChannel = async (client, serverId, channelId) => {
  const channels = getTextChannels(client, serverId);
  const channel = channels.get(channelId);

  const messages = await channel.messages.fetch({ limit: 30 });
  return messages;
}

module.exports = {
  getAvatars,
  getUsernames,
  deleteMessages,
  getTextChannelIDs,
  getMessagesFromGuildChannel
}