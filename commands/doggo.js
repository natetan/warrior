const getRandomDoggo = require('../services/getRandomDoggo');;

module.exports = {
  name: 'doggo',
  desc: 'Gets a random dog media (png, jpg, gif, wmv).',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      let doggoObj = await getRandomDoggo();
      if (doggoObj) {
        message.channel.send(doggoObj.url);
      } else {
        message.channel.send('There was an error. No doggos for you.');
      }
    } catch (err) {
      console.log(`ERROR: Command <doggo> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. No doggos for you.');
    }
  }
}