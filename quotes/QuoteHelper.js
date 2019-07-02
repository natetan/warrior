let quoteOptions = ['zmaja', 'rakkhat', 'ramsay', 'dragon', 'mage', 'serpent'];

function getQuote(quotes) {
  if (!quotes) {
    return null;
  }
  let length = quotes.length;
  let randomQuote = quotes[Math.floor(Math.random() * length)];
  return randomQuote;
}

module.exports = {
  getQuote: getQuote,
  quoteOptions: quoteOptions
}