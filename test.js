const { Temporal, PlainDate } = require("./test/util");

const date1 = PlainDate.from('2019-01-01');
const date2 = PlainDate.from('2019-06-01');
const date3 = PlainDate.from('2020-01-01');
const duration = date1.until(date3);
console.log(duration.toString());
