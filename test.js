var test = require('tap').test
var ghlink = require('./index.js')

var str = 'a u/p#123 b #234 c GH-345 d u/p@branch e feedcat deadbeef'
var project = 'me/proj'

test('lex', function(t) {
  var found = ghlink(str, { format: 'lex' })
  var wanted =
[ 'a ',
  { project: 'u/p',
    type: 'issue',
    id: '123',
    url: 'https://github.com/u/p/issue/123',
    raw: 'u/p#123' },
  ' b #234 c GH-345 d ',
  { project: 'u/p',
    type: 'commit',
    id: 'branch',
    url: 'https://github.com/u/p/commit/branch',
    raw: 'u/p@branch' },
  ' e feedcat deadbeef' ]
  t.similar(found, wanted)
  t.end()
})

test('lex proj', function(t) {
  var found = ghlink(str, { format: 'lex', project: project })
  var wanted =
[ 'a ',
  { project: 'u/p',
    type: 'issue',
    id: '123',
    url: 'https://github.com/u/p/issue/123',
    raw: 'u/p#123' },
  ' b ',
  { project: 'me/proj',
    type: 'issue',
    id: '234',
    url: 'https://github.com/me/proj/issue/234',
    raw: '#234' },
  ' c ',
  { project: 'me/proj',
    type: 'issue',
    id: '345',
    url: 'https://github.com/me/proj/issue/345',
    raw: 'GH-345' },
  ' d ',
  { project: 'u/p',
    type: 'commit',
    id: 'branch',
    url: 'https://github.com/u/p/commit/branch',
    raw: 'u/p@branch' },
  ' e feedcat ',
  { project: 'me/proj',
    type: 'commit',
    id: 'deadbeef',
    url: 'https://github.com/me/proj/commit/deadbeef',
    raw: 'deadbeef' } ]
  t.similar(found, wanted)
  t.end()
})

test('links', function(t) {
  var found = ghlink(str, {format: 'links'})
  var wanted = "[u/p#123]: https://github.com/u/p/issue/123\n[u/p@branch]: https://github.com/u/p/commit/branch\n"
  t.same(found, wanted)
  t.end();
})

test('links proj', function(t) {
  var found = ghlink(str, {format:'links', project:project})
  var wanted = "[u/p#123]: https://github.com/u/p/issue/123\n[#234]: https://github.com/me/proj/issue/234\n[GH-345]: https://github.com/me/proj/issue/345\n[u/p@branch]: https://github.com/u/p/commit/branch\n[deadbeef]: https://github.com/me/proj/commit/deadbeef\n"
  t.same(found, wanted)
  t.end()
})

test('markdown', function(t) {
  var found = ghlink(str, {format:'markdown'})
  var wanted = "a [u/p#123](https://github.com/u/p/issue/123) b #234 c GH-345 d [u/p@branch](https://github.com/u/p/commit/branch) e feedcat deadbeef"
  t.same(found, wanted)
  t.end()
})

test('markdown proj', function(t) {
  var found = ghlink(str, {format:'markdown', project:project})
  var wanted = "a [u/p#123](https://github.com/u/p/issue/123) b [#234](https://github.com/me/proj/issue/234) c [GH-345](https://github.com/me/proj/issue/345) d [u/p@branch](https://github.com/u/p/commit/branch) e feedcat [deadbeef](https://github.com/me/proj/commit/deadbeef)"
  t.same(found, wanted)
  t.end()
})

test('html', function(t) {
  var found = ghlink(str, {format:'html'})
  var wanted = "a <a href=\"https://github.com/u/p/issue/123\">u/p#123</a> b #234 c GH-345 d <a href=\"https://github.com/u/p/commit/branch\">u/p@branch</a> e feedcat deadbeef"
  t.same(found, wanted)
  t.end()
})

test('html proj', function(t) {
  var found = ghlink(str, {format:'html', project:project})
  var wanted = "a <a href=\"https://github.com/u/p/issue/123\">u/p#123</a> b <a href=\"https://github.com/me/proj/issue/234\">#234</a> c <a href=\"https://github.com/me/proj/issue/345\">GH-345</a> d <a href=\"https://github.com/u/p/commit/branch\">u/p@branch</a> e feedcat <a href=\"https://github.com/me/proj/commit/deadbeef\">deadbeef</a>"
  t.same(found, wanted)
  t.end()
})

test('text', function(t) {
  var found = ghlink(str, {format:'text'})
  var wanted = "a https://github.com/u/p/issue/123 b #234 c GH-345 d https://github.com/u/p/commit/branch e feedcat deadbeef"
  t.same(found, wanted)
  t.end()
})

test('text proj', function(t) {
  var found = ghlink(str, {format:'text', project:project})
  var wanted = "a https://github.com/u/p/issue/123 b https://github.com/me/proj/issue/234 c https://github.com/me/proj/issue/345 d https://github.com/u/p/commit/branch e feedcat https://github.com/me/proj/commit/deadbeef"
  t.same(found, wanted)
  t.end()
})

test('unknown', function(t) {
  t.throws(function() {
    ghlink(str, {format:'unknown'})
  })
  t.end()
})

test('unknown proj', function(t) {
  t.throws(function() {
    ghlink(str, {format:'unknown', project:project})
  })
  t.end()
})
