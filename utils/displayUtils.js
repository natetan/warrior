const days = {
  0: ['sun', 'sunday'],
  1: ['m', 'mon', 'monday'],
  2: ['t', 'tue', 'tues', 'tuesday'],
  3: ['w', 'wed', 'wednesday'],
  4: ['th', 'thu', 'thur', 'thurs', 'thursday'],
  5: ['f', 'fri', 'friday'],
  6: ['sat', 'saturday']
}

/**
 * Returns minutes and seconds in MM:ss format from milliseconds
 * @param {Number} millis milliseconds
 * @returns {String}
 */
const millisToMinutesAndSeconds = millis => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Converts a date to a shorted ISO date string (yyyy-MM-dd)
 * @param {String} dateString date string
 */
const dateToShortISO = dateString => {
  return new Date(dateString).toISOString().substring(0, 10);
}

/**
 * TODO: When unit testing this, re-write this to use a filter function
 * Given a day string, return its associated int
 * 
 * @param {String} day day of the week string
 * @returns {Number} number representing the day of the week. 0 - Sunday, 6 - Saturday
 */
function getDayNum(day) {
  let result = null;
  Object.keys(days).forEach((n) => {
    if (days[n].includes(day)) {
      result = n;
    }
  });
  return result;
}

/**
 * Gets the next day of the week
 * 
 * @param {string} day day of the week
 * @returns {Date}
 */
function getNextDay(day) {
  day = day.toLowerCase();
  if (day === 'today') {
    return new Date().toDateString().substring(0, 10);
  }
  let x = getDayNum(day);
  if (!x) {
    return new Error(`\`${day}\` is not a day. Please correct yourself.`);
  }
  let date = new Date();
  // Gets the next day of the week
  date.setDate(date.getDate() + (7 + x - date.getDay()) % 7);
  return date.toDateString().substring(0, 10);
}

module.exports = {
  millisToMinutesAndSeconds,
  dateToShortISO,
  getNextDay
}