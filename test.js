const { Temporal, PlainDate } = require("./test/util");

try {
  const actual = PlainDate.from("19761118junk");
  console.log(actual.toString());
} catch (e) {
  console.error(e);
}
