const getRandomDoggo = require('../services/getRandomDoggo');;

module.exports = {
  name: 'doggo',
  desc: 'Gets a random dog media (png, jpg, gif, wmv).',
  usage: '',
  async execute(message, args, client) {
    try {
      let doggoUrl = await getRandomDoggo();
      message.channel.send(doggoUrl.url);
    } catch (err) {
      console.log(`ERROR: Command <doggo> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. No doggos for you.');
    }
  }
}