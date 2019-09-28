const eu = require('../utils/embedUtils');
const emojis = require('../resources/emojis');

module.exports = {
  name: 'test',
  desc: 'Testing shit goes here.',
  commandType: 'private',
  async execute(message, args, client) {
    let testEmbed = eu.createExampleEmbed();
    try {
      let m = await message.channel.send(testEmbed);
      await m.react(emojis.examples.mt);
      await m.react(emojis.examples.ot);
      await m.react(emojis.examples.heals);
      await m.react(emojis.examples.stam);
      await m.react(emojis.examples.mag);
      await m.react(emojis.examples.cancel);

      const filter = (reaction, user) => {
        return Object.values(emojis.examples).includes(reaction.emoji.name) && user.id !== m.author.id;
      }

      m.awaitReactions(filter, { max: 2, time: 604800, errors: ['time'] })
        .then((collected) => {
          console.log('test');
          console.log(`<@${collected.first().users.first().id}>`);
          let usersList = [];
          collected.first().users.forEach((u) => {
            if (!u.bot) {
              usersList.push(u.username);
            }
          })
          message.channel.send(usersList);
        })
        .catch((collected) => {
          console.log('end');
          console.log(`After 1 second, we got ${collected.size} reactions`);
        });

    } catch (err) {
      console.log(`Error in testing: ${err}`);
    }
  }
}