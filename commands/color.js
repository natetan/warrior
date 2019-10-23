const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const displayUtils = require('../utils/displayUtils');
const Jimp = require('jimp');
const colorModifiers = require('../resources/color_modifiers.json');
const { performance } = require('perf_hooks');

module.exports = {
  name: 'color',
  desc: 'colors someone.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);

      let avatar = await Jimp.read(avatars.target);
      let outputName = 'color.png';

      let modifiers = [];
      let modifyAmount = Math.floor(Math.random() * colorModifiers.length);

      // Clone the array
      let mods = colorModifiers.slice();
      let color = displayUtils.getRandomHex();
      for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * mods.length);
        const mod = mods[randomIndex];
        const obj = { apply: mod.modifier };
        if (mod.inputType === 'color') {
          obj.params = [color];
        } else {
          let min = mod.range[0];
          let max = mod.range[1];

          // The maximum is inclusive and the minimum is inclusive
          let value = Math.floor(Math.random() * (max - min + 1)) + min;
          obj.params = [value];
        }
        mods = mods.filter(m => m.modifier !== mod.modifier);
        modifiers.push(obj);
      }

      let start = performance.now();
      avatar.color(modifiers);
      let end = performance.now();

      let modifierString = 'These modifiers were applied:';
      modifiers.forEach(m => {
        let value = m.params[0];
        if (m.apply === 'mix') {
          value = color;
        }
        modifierString += `\n\t- ${m.apply}: ${value}`;
      });

      modifierString += `\nProcessing time took ${Math.round((end - start) / 1000)} seconds.`;

      let error, res = await avatar.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send(modifierString, attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <color> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}