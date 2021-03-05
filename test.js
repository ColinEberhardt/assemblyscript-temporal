const { Temporal, PlainDate } = require("./test/util");

const actual = PlainDate.from({ year: 43, month:11, day:22 });
console.log(actual.subtract({ years: 43 }).toString());
