const displayUtils = require('../utils/displayUtils');

module.exports = {
  name: 'ask',
  desc: 'Ask and you shall receive',
  usage: '<question>',
  args: true,
  commandType: 'general',
  async execute(message, arg, client, logger) {
    const options = [
      'yes!!!!',
      'lol yes u dumb fuck',
      'yes, idiot',
      'yeet',
      'when you grow a braincell, then yes',
      'lol sure',
      'lol literally no',
      'honestly, no one cares',
      'don\'t sass me bitch',
      'i\'m not sure but ur def stupid',
      '...isn\'t that obvious?',
      'you might as well ask me if the sky is blue',
      'the only thing worse than that question is your dps',
      'you\'re getting hit by a thousand cuts for that stupid question',
      'uhhhh, maybe?',
      'lol who tf rly knows',
      'idk buuuuut....**DEATH, BY A THOUSAND CUTS!!!** (you\'re dead btw)',
      'ask me later when i\'m not busy thinking about how much your mum',
      'hell no u whore',
      'i can tell u with absolute certainty, *no*',
      'no lmfao',
      'no, u dingleberry',
      'no, u vitamin-d deficient circus clown',
      'no???',
      'no!!!!'
    ]
    try {
      let index = displayUtils.getRandomArrayIndex(options);
      let res = options[index];
      await message.channel.send(res);
    } catch (err) {
      logger.error({
        user: message.author.username,
        content: message.content,
        error: err
      });
    }
  }
}