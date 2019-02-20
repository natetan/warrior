let fetch = require('node-fetch');
let $ = require('cheerio');

const ESO_LEADERBOARDS_URL = 'https://esoleaderboards.com/';

async function getHtml(url) {
  let res = await fetch(url);
  if (res.status === 200) {
    return res.text();
  } else {
    return null;
  }
}

async function getDailies() {
  let html = await getHtml(ESO_LEADERBOARDS_URL);

  let p1 = $('tbody tr:nth-child(4) td:nth-child(2) strong', html).first().text();
  let p2 = $('tbody tr:nth-child(4) td:nth-child(3) strong', html).first().text();
  let p3 = $('tbody tr:nth-child(4) td:nth-child(4) strong', html).first().text();
  let date = new Date().toDateString().substring(0, 10);

  let results = `Pledges for ${date}:\n\t- ${p1}\n\t- ${p2}\n\t- ${p3}`;
  return results;
}

module.exports = {
  getDailies: getDailies
}