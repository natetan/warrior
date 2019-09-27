const quoteOptions = ['zmaja', 'rakkhat', 'ramsay', 'dragon', 'mage', 'serpent'];

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

module.exports = {
  getQuote,
  quoteOptions
}