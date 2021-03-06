const assert = require('assert').strict;
const { equal, notEqual, throws } = assert;

const { Temporal, PlainTime } = require("./util");

describe('Date', () => {
  describe('Structure', () => {
    it('Time is a Function', () => {
      equal(typeof PlainTime, 'function');
    });
    it('Time has a prototype', () => {
      assert(PlainTime.prototype);
      equal(typeof PlainTime.prototype, 'object');
    });
    describe('Time.prototype', () => {
      xit('Time.prototype has calendar', () => {
        assert('calendar' in PlainTime.prototype);
      });
      it('Time.prototype has hour', () => {
        assert('hour' in PlainTime.prototype);
      });
      it('Time.prototype has minute', () => {
        assert('minute' in PlainTime.prototype);
      });
      it('Time.prototype has second', () => {
        assert('second' in PlainTime.prototype);
      });
      it('Time.prototype has millisecond', () => {
        assert('millisecond' in PlainTime.prototype);
      });
      it('Time.prototype has microsecond', () => {
        assert('microsecond' in PlainTime.prototype);
      });
      it('Time.prototype has nanosecond', () => {
        assert('nanosecond' in PlainTime.prototype);
      });
      xit('Time.prototype.with is a Function', () => {
        equal(typeof PlainTime.prototype.with, 'function');
      });
      xit('Time.prototype.add is a Function', () => {
        equal(typeof PlainTime.prototype.add, 'function');
      });
      xit('Time.prototype.subtract is a Function', () => {
        equal(typeof PlainTime.prototype.subtract, 'function');
      });
      xit('Time.prototype.until is a Function', () => {
        equal(typeof PlainTime.prototype.until, 'function');
      });
      xit('Time.prototype.since is a Function', () => {
        equal(typeof PlainTime.prototype.since, 'function');
      });
      xit('Time.prototype.round is a Function', () => {
        equal(typeof PlainTime.prototype.round, 'function');
      });
      it('Time.prototype.equals is a Function', () => {
        equal(typeof PlainTime.prototype.equals, 'function');
      });
      xit('Time.prototype.toPlainDateTime is a Function', () => {
        equal(typeof PlainTime.prototype.toPlainDateTime, 'function');
      });
      xit('Time.prototype.toZonedDateTime is a Function', () => {
        equal(typeof PlainTime.prototype.toZonedDateTime, 'function');
      });
      xit('Time.prototype.getISOFields is a Function', () => {
        equal(typeof PlainTime.prototype.getISOFields, 'function');
      });
      xit('Time.prototype.toString is a Function', () => {
        equal(typeof PlainTime.prototype.toString, 'function');
      });
      xit('Time.prototype.toJSON is a Function', () => {
        equal(typeof PlainTime.prototype.toJSON, 'function');
      });
    });
    it('Time.from is a Function', () => {
      equal(typeof PlainTime.from, 'function');
    });
    it('Time.compare is a Function', () => {
      equal(typeof PlainTime.compare, 'function');
    });
  });

  // TODO Construction
});
