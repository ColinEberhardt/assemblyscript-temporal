const { Temporal, PlainDate } = require("./test/util");

const actual = PlainDate.from({ year: 1997, month:11, day:22 });
const newOne = actual.with({ day: 17 });
console.log(newOne.toString());
