const getRandomFox = require('../services/getRandomFox');

module.exports = {
  name: 'foxy',
  desc: 'Gets a random fox media (png, jpg, gif, wmv).',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      let foxObj = await getRandomFox();
      if (foxObj) {
        message.channel.send(foxObj.image);
      } else {
        message.channel.send('There was an error. No doggos for you.');
      }
    } catch (err) {
      console.log(`ERROR: Command <foxy> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. No foxes for you.');
    }
  }
}