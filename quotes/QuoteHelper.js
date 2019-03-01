let quoteOptions = ['zmaja', 'rakkhat', 'ramsay'];

function getQuote(quotes) {
  let length = quotes.length;
  let randomQuote = quotes[Math.floor(Math.random() * length)];
  return randomQuote;
}

module.exports = {
  getQuote: getQuote,
  quoteOptions: quoteOptions
}