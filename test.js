const { Temporal, PlainDate } = require("./test/util");

const actual = PlainDate.from("19761118");
console.log(actual.subtract({ years: 43 }).toString());
