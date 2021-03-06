## assemblyscript-temporal

A **very** experimental implementation of temporal within AssemblyScript.

### Why?

AssemblyScript has minimal `Date` support, however, the JS Date API itself is terrible and people tend not to use it that often. As a result libraries like moment / luxon have become staple replacements.

However, there is now a [relatively mature TC39 proposal](https://github.com/tc39/proposal-temporal) that adds greatly improved date support to JS. This projects explores the the feasibility of porting this library.

Note, that string parsing is an important feature of any date library, and as a result, this project relies on the [assemblyscript-regex](https://github.com/ColinEberhardt/assemblyscript-regex) library.

### Implementation approach

The current approach is as follows:

1. Use the temporal polyfill test cases as a means to ensure implementation correctness. Currently these test cases are cut / paste with a few tweaks. Ideally this would be automated to ensure parity going forwards
2. Start simple ... start with `PlainDate`
3. Use the polyfill implementation as a starting point. However, it is riddled with JS-specific code that doesn't make sense to port. However, most of the algorithmic code is [within a single file](https://github.com/tc39/proposal-temporal/blob/main/polyfill/lib/ecmascript.mjs), which can be ported relatively easily.
4. Don't bother refactoring heavily, being able to map between the polyfill implementation and this codebase will help ensure correctness


The current AssemblyScript PlainDate implementation passes 77 of the 241 tests, which is not a bad start!

*If you have thoughts / ideas on the implementation technique, please open an issue*

This project is still very much in the early exploration phase. I'd like to implement more of the temporal features and uncover more of the underlying challenge (see below) before starting on a more structured implementation roadmap.

*If you have thoughts / ideas on the above, please open an issue*
