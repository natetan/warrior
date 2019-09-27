const millisToMinutesAndSeconds = millis => {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const dateToShortISO = dateString => {
  return new Date(dateString).toISOString().substring(0, 10);
}

module.exports = {
  millisToMinutesAndSeconds,
  dateToShortISO
}