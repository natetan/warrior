let fetch = require('node-fetch');
let fs = require('fs');

async function GetAsync(url, options = {}) {
  try {
    let res = await fetch(url, options);
    return res.json();
  } catch (err) {
    console.log(`Error in <RestClient.GetAsync()>: ${err}`);
    return null;
  }
}

async function SaveJsonAsync(url, options = {}) {
  try {
    let json = await GetAsync(url, options);
    await fs.writeFileSync('eso_sets.json', JSON.stringify(json, null, 2), (err) => {
      console.log(`File save error: ${err}`);
    });
    return true;
  } catch (e) {
    console.log(`Error in <RestClient.SaveJsonAsync()>: ${err}`);
    return false;
  }
}

module.exports = {
  GetAsync: GetAsync,
  SaveJsonAsync: SaveJsonAsync
}