const getRandomCat = require('../services/getRandomCat');

module.exports = {
  name: 'meow',
  desc: 'Companion command of doggo -- random cats!',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      let catResponse = await getRandomCat();
      if (catResponse) {
        message.channel.send(catResponse.file);
      } else {
        message.channel.send('There was an error. No cats for you.');
      }
    } catch (err) {
      console.log(`ERROR: Command <meow> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. No cats for you.');
    }
  }
}