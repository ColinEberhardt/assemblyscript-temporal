const { Temporal, PlainDate } = require("./test/util");

console.log(process.version);

const date = new PlainDate(1969, 7, 24);
const duration = date.until(PlainDate.from({ year: 1969, month: 10, day: 5 }));
console.log(duration.toString());
