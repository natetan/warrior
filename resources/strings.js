const commands = {
  define: 'Defines a word. Usage: \`!define {word}\`',
  raid: 'Helps with raids. Usage: \n\`!raid create {day} {time} {trial}\` - Creates a raid post. Day param lets you use abbreviations, as well as today. Example: \`!raid create w 1030est vmaw\`.\n\`!raid delete\` - Deletes the raid post.',
  roles: 'Lists roles. Usage: \n\`!roles all\` - lists all roles and everyone in those roles/\n!roles count - lists all roles and number of people in them.\n!roles - lists all your roles.',
  ping: 'Calculates your ping and the bot\'s ping. Usage: \`!ping\`',
  pledges: 'Grabs the daily pledge from esoleaderboards.com. Usage: \`!pledges\`',
  quotes: 'warrior, zmaja, rakkhat',
  translate: 'Translates given text into target language. Usage: \`!translate {targetLanguage} {phrase}\`. Example: !translate spanish this is a test',
  urban: 'Gets the Urban Dictionary definition for a phrase. Usage: \`!urban {phrase}\`. Example (not recommended): \`!urban alabama hot pocket\`'
}

module.exports = {
  commands: commands
}