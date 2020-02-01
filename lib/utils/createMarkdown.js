const fs = require('fs');

const commandFiles = fs.readdirSync('../../commands').filter(file => file.endsWith('.js'));

const createMarkdown = () => {
  let intro = `# Warrior\nDiscord Bot for ESO\n\nAuthor: [Nate](https://github.com/natetan)\n`;
  let desc = `## This is an Elder Scrolls Online based discord bot. It provides game-lookup functionality and commands for memes.\n\n`;
  let list = '### Commands (prefix: `!`)\n';
  let general = '**General**\n';
  let quotes = '\n**Quotes**\n';
  let imgen = '\n**Imgen**\n';
  for (const file of commandFiles) {
    const command = require(`../../commands/${file}`);
    let name = command.name;
    let desc = command.desc;
    let usage = command.usage ? ` ${command.usage}` : '';
    let c = `- ${name}${usage}: ${desc}\n`;
    if (command.commandType === 'general') {
      general += c;
    } else {
      if (command.category === 'quotes') {
        quotes += c;
      } else if (command.category === 'imgen') {
        imgen += c;
      }
    }
  }
  const final = intro + desc + list + general + quotes + imgen;
  
  fs.writeFile('../../README.md', final, error => {
    if (error) {
      console.log(`Error in file write: ${error}`);
    }
    console.log('Success! File created');
  })
}

createMarkdown();