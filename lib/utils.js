var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , debug = require('debug')('fsquery')
  , minimatch = require('minimatch');

function isDirectory(name, done) {
  fs.stat(name, function (err, stat) {
    if (err) return done(false);
    done(stat.isDirectory());
  });
}

function isFile(name, done) {
  fs.stat(name, function (err, stat) {
    if (err) return done(false);
    done(stat.isFile());
  });
}

function getMatch(name) {
  if (typeof name !== 'string') return '';
  var match = name.split(':');
  return match;
}

exports.readdir = function (name, done) {
  fs.readdir(name, function (err, results) {
    if (err) return done(err);
    done(null, results.map(function (result) {
      return path.resolve(name, result);
    }));
  });
}

exports.getFilter = function (name) {
  debug('getFilter : ' + name);
  if (typeof name !== 'string') return null;
  if ({'': 1, '*': 1}[name]) return null;
  var match = getMatch(name);
  var matcher = match[0] === ''
    ? null
    : match[0];

  var _filter = {
    file: isFile
  , dir: isDirectory
  }[match[1]];

  var filter = _filter && (function(){
    return function (names, done) {
      async.filter(names, _filter, done);
    };
  })();

  if (!matcher && !filter) return null;
  if (matcher && filter) {
    debug('minimatch and filter ' + name);
    return function (names, done) {
      names = minimatch.match(names, match[0], { matchBase: true });
      filter(names, done);
    }
  }

  if (matcher) {
    return function (names, done) {
      debug('minimatch')
      debug(names.length);
      names = minimatch.match(names, match[0], { matchBase: true });
      debug(names.length);
      done(names);
    };
  }
 
  return filter;
}
