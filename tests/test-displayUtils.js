const expect = require('chai').expect;
const displayUtils = require('../utils/displayUtils');

describe('displayUtil tests', () => {

  describe('millisToMinutesAndSeconds', () => {
    it ('returns 0:00 when given null', () => {
      const millis = null;
      const expected = '0:00';

      const actual = displayUtils.millisToMinutesAndSeconds(millis);

      expect(actual).to.equal(expected);
    });

    it ('returns 0:00 when empty', () => {
      const millis = '';
      const expected = '0:00';

      const actual = displayUtils.millisToMinutesAndSeconds(millis);

      expect(actual).to.equal(expected);
    });

    it ('converts to mins and secs - case 1', () => {
      const millis = 390000;
      const expected = '6:30';

      const actual = displayUtils.millisToMinutesAndSeconds(millis);

      expect(actual).to.equal(expected);
    });

    it ('converts to mins and secs - case 2', () => {
      const millis = 211000;
      const expected = '3:31';

      const actual = displayUtils.millisToMinutesAndSeconds(millis);

      expect(actual).to.equal(expected);
    });

    it ('converts to mins and secs - case 3', () => {
      const millis = 323000;
      const expected = '5:23';

      const actual = displayUtils.millisToMinutesAndSeconds(millis);

      expect(actual).to.equal(expected);
    });
  });

  describe('getNextDay', () => {
    it('returns empty string when day is null', () => {
      const str = null;
      const expected = '';

      const actual = displayUtils.getNextDay(str);

      expect(actual).to.equal(expected);
    });

    it('returns empty string when day is empty', () => {
      const str = '';
      const expected = '';

      const actual = displayUtils.getNextDay(str);

      expect(actual).to.equal(expected);
    });

    it('returns next date - case 1', () => {
      const str = 'm';
      const expected = 1;

      const actual = `${displayUtils.getNextDay(str)} ${new Date().getFullYear()}`;
      const day = new Date(actual).getDay();

      expect(day).to.equal(expected);
    });

    it('returns next date - case 2', () => {
      const str = 'tue';
      const expected = 2;

      const actual = `${displayUtils.getNextDay(str)} ${new Date().getFullYear()}`;
      const day = new Date(actual).getDay();

      expect(day).to.equal(expected);
    });

    it('returns next date - case 3', () => {
      const str = 'wednesday';
      const expected = 3;

      const actual = `${displayUtils.getNextDay(str)} ${new Date().getFullYear()}`;
      const day = new Date(actual).getDay();

      expect(day).to.equal(expected);
    });

    it('returns next date - case 4', () => {
      const str = 'th';
      const expected = 4;

      const actual = `${displayUtils.getNextDay(str)} ${new Date().getFullYear()}`;
      const day = new Date(actual).getDay();

      expect(day).to.equal(expected);
    });
  });
})