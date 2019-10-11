const getCommaSplitMessage = (message) => {
  const res = {
    first: 'Separate the items with a',
    second: 'comma followed by a space'
  };
  if (!message || !message.length()) {
    return res;
  }
  const [first, second] = message.split(', ');
  if (!first || !second) {
    return res;
  }
  return {
    first: first,
    second: second
  };
}

module.exports = {
  getCommaSplitMessage
};