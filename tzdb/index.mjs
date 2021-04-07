import fs from "fs";
import { parserDatabase } from "./parser.mjs";
import { emit } from "./emitter.mjs";
import prettier from "prettier";

const uk = fs.readFileSync("tzdb/uk", "UTF8");
const db = parserDatabase(uk);
const as = emit(db);

fs.writeFileSync(
  "assembly/tz/uk.ts",
  prettier.format(as, { parser: "typescript" })
);
