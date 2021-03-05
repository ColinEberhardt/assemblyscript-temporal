import "assemblyscript/std/portable/index";

const globalAny: any = global;
globalAny.log = console.log;

import { Duration, PlainDate } from "../assembly/index";

let date = PlainDate.fromString("2019-10-06");
let add = date.add(new Duration(0, 0, 0, 0, 24));
console.log(date, add);