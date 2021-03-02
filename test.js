const { Temporal, PlainDate } = require("./test/util");

const orig = new PlainDate(1976, 11, 18);
const actual = PlainDate.from(orig);