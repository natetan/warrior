const db = require('./db').getInstance();

const getToggle = async toggle => {
  try {
    const ref = db.ref(`toggles/${toggle}`);
    let data = null;
    await ref.once('value', snapshot => {
      data = snapshot.val();
    });
    return data;
  } catch (err) {
    console.log(`There was an issue with grabbing toggle ${toggle}.`);
    return null;
  }
}

module.exports = {
  getToggle
}