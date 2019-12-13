const discordUtils = require('../utils/discordUtils');
const displayUtils = require('../utils/displayUtils');

module.exports = {
  name: 'waifu',
  desc: 'Your waifu ranking',
  usage: '[username]',
  commandType: 'general',
  async execute(message, arg, client) {
    const usernames = discordUtils.getUsernames(message);
    const target = usernames.target ? usernames.target : usernames.self;
    const rating = displayUtils.getRandomIntInclusive(0, 100);
    let emoji = '';
    if (rating === 0) {
      emoji = ':poop:';
    } else if (rating < 10) {
      emoji = ':face_vomiting:';
    } else if (rating < 40) {
      emoji = ':sick:';
    } else if (rating < 60) {
      emoji = ':rolling_eyes:';
    } else if (rating < 80) {
      emoji = ':slight_smile:';
    } else if (rating < 90) {
      emoji = ':yum:';
    } else if (rating < 100) {
      emoji = ':kissing_heart:'
    } else {
      emoji = ':heart_eyes: :heart:'
    }
    return message.channel.send(`${target} is ${rating}/100 waifu ${emoji}`);
  }
}