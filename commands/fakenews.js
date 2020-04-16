const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'fakenews',
  desc: 'FOX is not the only fake news channel.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/fakenews.bmp';
      let avatar = await Jimp.read(avatars.target);
      let base = await Jimp.read(imageURL);
      let coverUp = base.clone();
      let outputName = 'fakenews.png';

      const avatarWidth = 300;
      const avatarHeight = 260;
      const overlayHeight = 55;

      const bottomTvToTopRemoteOffset = 65;
      const rightCropX = 210;

      avatar.resize(avatarWidth, avatarHeight);

      let leftAvatar = avatar.clone();
      let rightAvatar = avatar.clone();

      coverUp.crop(0, 200, 200, 200);

      avatar.crop(0, 0, avatar.getWidth(), avatarHeight - bottomTvToTopRemoteOffset);
      leftAvatar.crop(0, avatarHeight - bottomTvToTopRemoteOffset, 110, bottomTvToTopRemoteOffset);
      rightAvatar.crop(rightCropX, avatarHeight - bottomTvToTopRemoteOffset, avatarWidth - rightCropX, bottomTvToTopRemoteOffset);

      await base
        .composite(coverUp, 0 ,0)
        .composite(avatar, 450, overlayHeight)
        .composite(leftAvatar, 450, overlayHeight + avatar.getHeight())
        .composite(rightAvatar, 450 + rightCropX, overlayHeight + avatar.getHeight());

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <fakenews> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}