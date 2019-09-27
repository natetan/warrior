/**
 * 
 * @param {Array} quotes array of quotes
 */
const getQuote = quotes => {
  if (!quotes) {
    return null;
  }
  let length = quotes.length;
  let randomQuote = quotes[Math.floor(Math.random() * length)];
  return randomQuote;
}

const determineQuote = (message, quotes, destroy = null, emoji = null) => {
  let results = message.mentions.users.map((u) => {
    return `<@${u.id}>`;
  });

  if (results.length > 0 && destroy) {
    let person = results[0];
    let randomQuote = getQuote(destroy);
    randomQuote = randomQuote.replace('@', person);
    return randomQuote;
  } else {
    let randomQuote = getQuote(quotes);
    return `${emoji || ''} ${randomQuote}`;
  }
}

module.exports = {
  getQuote,
  determineQuote
}