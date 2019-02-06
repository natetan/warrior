let days = {
  0: ["sun", "sunday"],
  1: ["m", "mon", "monday"],
  2: ["t", "tue", "tues", "tuesday"],
  3: ["w", "wed", "wednesday"],
  4: ["th", "thur", "thu", "thursday"],
  5: ["f", "fri", "friday"],
  6: ["sat", "saturday"]
}

function getDayNum(day) {
  let result = null;
  Object.keys(days).forEach((n) => {
    if (days[n].includes(day)) {
      result = n;
    }
  });
  return result;
}

function getNextDay(day) {
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
  getNextDay: getNextDay
}