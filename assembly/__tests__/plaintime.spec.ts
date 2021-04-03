import { Duration, DurationLike } from "../duration";
import { PlainTime } from "../plaintime";

let time: PlainTime;

describe("Construction", () => {
  describe("complete", () => {
    time = new PlainTime(15, 23, 30, 123, 456, 789);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 123", () => {
      expect(time.millisecond).toBe(123);
    });
    it("time.microsecond is 456", () => {
      expect(time.microsecond).toBe(456);
    });
    it("time.nanosecond is 789", () => {
      expect(time.nanosecond).toBe(789);
    });
    // it("time.calendar.id is iso8601", () =>
    //   expect(time.calendar.id).toBe("iso8601"));
    // it("`${time}` is 15:23:30.123456789", () =>
    //   expect(`${time}`).toBe("15:23:30.123456789"));
  });
  describe("missing nanosecond", () => {
    time = new PlainTime(15, 23, 30, 123, 456);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 123", () => {
      expect(time.millisecond).toBe(123);
    });
    it("time.microsecond is 456", () => {
      expect(time.microsecond).toBe(456);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("`${time}` is 15:23:30.123456", () => {
    //   expect(`${time}`).toBe("15:23:30.123456");
    // });
  });
  describe("missing microsecond", () => {
    time = new PlainTime(15, 23, 30, 123);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 123", () => {
      expect(time.millisecond).toBe(123);
    });
    it("time.microsecond is 0", () => {
      expect(time.microsecond).toBe(0);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("`${time}` is 15:23:30.123", () => {
    //   expect(`${time}`).toBe("15:23:30.123");
    // });
  });
  describe("missing millisecond", () => {
    time = new PlainTime(15, 23, 30);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 30", () => {
      expect(time.second).toBe(30);
    });
    it("time.millisecond is 0", () => {
      expect(time.millisecond).toBe(0);
    });
    it("time.microsecond is 0", () => {
      expect(time.microsecond).toBe(0);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("`${time}` is 15:23:30", () => equal(`${time}`, "15:23:30"));
  });
  describe("missing second", () => {
    time = new PlainTime(15, 23);
    it("time.hour is 15", () => {
      expect(time.hour).toBe(15);
    });
    it("time.minute is 23", () => {
      expect(time.minute).toBe(23);
    });
    it("time.second is 0", () => {
      expect(time.second).toBe(0);
    });
    it("time.millisecond is 0", () => {
      expect(time.millisecond).toBe(0);
    });
    it("time.microsecond is 0", () => {
      expect(time.microsecond).toBe(0);
    });
    it("time.nanosecond is 0", () => {
      expect(time.nanosecond).toBe(0);
    });
    // it("`${time}` is 15:23:00", () => equal(`${time}`, "15:23:00"));
  });
  describe("missing minute", () => {
    const time = new PlainTime(15);
    // it("`${time}` is 15:00:00", () => equal(`${time}`, "15:00:00"));
  });
  describe("missing all parameters", () => {
    const time = new PlainTime();
    // it("`${time}` is 00:00:00", () => equal(`${time}`, "00:00:00"));
  });
});

// describe('Time.compare() works', () => {
//   const t1 = PlainTime.from('08:44:15.321');
//   const t2 = PlainTime.from('14:23:30.123');
//   it('equal', () => equal(PlainTime.compare(t1, t1), 0));
//   it('smaller/larger', () => equal(PlainTime.compare(t1, t2), -1));
//   it('larger/smaller', () => equal(PlainTime.compare(t2, t1), 1));
//   it('casts first argument', () => {
//     equal(PlainTime.compare({ hour: 16, minute: 34 }, t2), 1);
//     equal(PlainTime.compare('16:34', t2), 1);
//   });
//   it('casts second argument', () => {
//     equal(PlainTime.compare(t1, { hour: 16, minute: 34 }), -1);
//     equal(PlainTime.compare(t1, '16:34'), -1);
//   });
//   it('object must contain at least one correctly-spelled property', () => {
//     throws(() => PlainTime.compare({ hours: 16 }, t2), TypeError);
//     throws(() => PlainTime.compare(t1, { hours: 16 }), TypeError);
//   });
// });
// describe('time.equals() works', () => {
//   const t1 = PlainTime.from('08:44:15.321');
//   const t2 = PlainTime.from('14:23:30.123');
//   it('equal', () => assert(t1.equals(t1)));
//   it('unequal', () => assert(!t1.equals(t2)));
//   it('casts argument', () => {
//     assert(t1.equals('08:44:15.321'));
//     assert(t1.equals({ hour: 8, minute: 44, second: 15, millisecond: 321 }));
//   });
//   it('object must contain at least one correctly-spelled property', () => {
//     throws(() => t1.equals({ hours: 8 }), TypeError);
//   });
// });