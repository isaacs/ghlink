module.exports = ghlink;

function ghlink(source, options) {
  options = options || {}
  var project = options.project || null
  var format = options.format || 'text'

  switch (format) {
    case 'text':
    case 'lex':
    case 'html':
    case 'markdown':
    case 'links':
      return pretty(parse(source, project), format)
    default:
      throw new Error('unsupported format: ' + format)
  }
}



// 1, 2, 3
var issue = '([\\w.-]+)\\/([\\w.-]+)#([0-9]+)'
// 4
var issuep = '#([0-9]+)'
// 5
var issueg = 'GH-([0-9]+)'

// 6, 7, 8
var commit = '([\\w.-]+)\\/([\\w.-]+)@([\\w.-]+)'
// 9
var sha = '\\b([a-f0-9]{6,40})\\b'

var src = [issue, issuep, issueg, commit, sha].join('|')
var re = new RegExp(src, 'ig')

function parse(source, project) {
  var match
  var i = 0
  var res = []
  while (match = re.exec(source)) {
    var p = null, type = null, id = null
    if (match[1] && match[2] && match[3]) {
      p = match[1] + '/' + match[2]
      type = 'issue'
      id = match[3]
    } else if (match[4] && project) {
      p = project
      type = 'issue'
      id = match[4]
    } else if (match[5] && project) {
      p = project
      type = 'issue'
      id = match[5]
    } else if (match[6] && match[7] && match[8]) {
      p = match[6] + '/' + match[7]
      type = 'commit'
      id = match[8]
    } else if (match[9] && project) {
      p = project
      type = 'commit'
      id = match[9]
    }
    if (type) {
      res.push(source.slice(i, match.index))
      i = match.index + match[0].length
      res.push(new Link(p, type, id, match[0]))
    }
  }
  if (i < source.length)
    res.push(source.slice(i))
  return res
}

function Link(project, type, id, raw) {
  this.project = project;
  this.type = type;
  this.id = id;
  this.url = 'https://github.com/' + project + '/' + type + '/' + id;
  this.raw = raw;
}

function pretty(lex, fmt) {
  return fmt === 'lex' ? lex : lex.map(function(c) {
    return typeof c === 'string' ?
            (fmt === 'links' ? null : c) :
           fmt === 'links' ? '[' + c.raw + ']: ' + c.url + '\n' :
           fmt === 'markdown' ? '[' + c.raw + '](' + c.url + ')' :
           fmt === 'html' ? '<a href="' + c.url + '">' + c.raw + '</a>' :
           fmt === 'text' ? c.url :
           c.raw
  }).map(function(c) {
    return c
  }).join('');
}
