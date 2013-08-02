# ghlink

Turn stuff like `isaacs/npm#1234` into
`https://github.com/isaacs/npm/issues/1234`, for your hyperlinking
pleasure.

## USAGE

`ghlink(input, [options])`

The options can have a `format` field (default = `'text'`) and a
`project` field (default = `null`).

```javascript
var ghlink = require('ghlink');
var someString = 'hello world user/project#12 fixed by isaacs/node@deadbeef';

var textOutput = ghlink(someString);
console.log(textOutput)
// hello world https://github.com/user/project/issues/12 fixed by
// https://github.com/isaacs/node/commit/deadbeef

var htmlOutput = ghlink(someString, { format: 'html' });
console.log(htmlOutput)
// hello world <a href="https://github.com/user/project/issues/12">user/project#12</a> fixed by
// <a href="https://github.com/isaacs/node/commit/deadbeef">isaacs/node@deadbeef</a>

var links = ghlink(someString, { format: 'links' });
// [user/project#12]: https://github.com/user/project/issues/12
// [isaacs/node@deadbeef]: https://github.com/isaacs/node/commit/deadbeef

var md = ghlink(someString, { format: 'markdown' });
// hello world [user/project#12](https://github.com/user/project/issues/12) fixed by
// [isaacs/node@deadbeef](https://github.com/isaacs/node/commit/deadbeef)

var lexed = ghlink(someString, { format: 'lex' });
// lexed is now an array with some strings and some objects huzzah.

var linkobj = ghlink(someString, { format: 'linkobj' })
// like lexed, but just the link objects, no strings
```

The `project` field in the options object should be something like
`user/project`, and then stuff like `GH-1234` or `#223` are assumed to
be for that project.

Note that this module does *not* look up anything at any github API to
verify that the references actually exist, or to provide titles or
anything else.  It's strictly a string munging utility.
