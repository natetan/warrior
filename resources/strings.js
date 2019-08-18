const commands = {
  define: 'Defines a word. Usage: \`!define {word}\`',
  doggo: 'Grabs a random dog media.',
  game: 'Game commands. Usage: \n`!game setup` - sets up everyone with money.\n`!game funds` - Checks your funds\n`!game give <player> <amount>` - Gives the specified player the specified amount',
  meme: 'Random meme from reddit',
  memes: 'airpods, egg, rip, shit, slap',
  ping: 'Calculates your ping and the bot\'s ping. Usage: \`!ping\`',
  pledges: 'Grabs the daily pledge from esoleaderboards.com. Usage: \`!pledges\`',
  purge: 'Purges messages. Admin only. Usage: \n`!purge <x>` - purges x messages where x is a number between 1 (exclusive) and 10 (inclusive)',
  quotes: 'warrior, zmaja, rakkhat',
  roles: 'Lists roles. Usage: \n\`!roles all` - lists all roles and everyone in those roles/\n`!roles count` - lists all roles and number of people in them.\n`!roles` - lists all your roles.',
  set: 'Gets sets from eso-sets. Usage:\n`set <set-name>` -- Gets set by name\n`!set <id>` - Gets set by id',
  trial: 'See `!trial help',
  urban: 'Gets the Urban Dictionary definition for a phrase. Usage: \`!urban {phrase}\`. Example (not recommended): \`!urban alabama hot pocket\`'
}

module.exports = {
  commands: commands
}