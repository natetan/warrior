const expect = require('chai').expect;
const displayUtils = require('../utils/displayUtils');

describe('displayUtil tests', () => {

  describe('millisToMinutesAndSeconds', () => {
    it ('should return 0:00 when given null', () => {
      const millis = null;
      const expected = '0:00';

      const actual = displayUtils.millisToMinutesAndSeconds(millis);

      expect(actual).to.equal(expected);
    })
  })

})