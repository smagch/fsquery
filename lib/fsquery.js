

var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits
  , minimatch = require('minimatch')
  , debug = require('debug')('fsquery')

/**
 * fsQuery('/tmp')
 *   .childern(':dir')
 *     .each(function () {
 *       // I am a directory
 *       // this = '/tmp/hoge/', '/tmp/foo/'
 *     }).end()
 *   .children(':file')
 *     .each(function () {
 *       // I am a file
 *       // this = '/tmp/foo.txt'
 *     }).end()
 *
 * is equal to
 *
 * fsQuery('/tmp')
 *   .children()
 *     .filter(':dir')
 *       .each(function () {})
 *       .end()
 *     .filter(':file')
 *       .each(function () {})
 *       .end()
 *
 * fsQuery('/tmp')
 *
 */

/**
   fsQuery('/tmp') // context ['/tmp']
    .children() // context [{ /tmp', ['hoge1', 'hoge2', 'hoge3']]]
      .children() // context ['/tmp', 
      .end()
    .end()
  .get(function (err) {
    // this is '/tmp'
  })
             ['hoge1', ['foo1']],
             ['hoge2', ['foo2]],
             ['hoge3', ['foo3]]
           ]



 */

var defaults = {
  cwd: path.resolve('.')
}

function fsQuery(options) {
  return new FsQuery(options);
}

function FsQuery(options) {
  if (typeof options === 'string') {
    this.contexts = [options];
  } else if (Array.isArray(options)){
    this.contexts = options;
  }
}

inherits(FsQuery, EventEmitter);

module.exports = exports = fsQuery;
exports.FsQuery = FsQuery;

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

function readdir(name, done) {
  fs.readdir(name, function (err, results) {
    if (err) return done(err);
    done(null, results.map(function (result) {
      return path.resolve(name, result);
    }));
  });
}

function getMatch(name) {
  if (typeof name !== 'string') return '';
  var match = name.split(':');
  return match;
}

function getFilter(name) {
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

function getMinimatch(name) {
  if (typeof name !== 'string') return null;
  var match = getMatch(name)[0];
  if (match === '') return null;
  return minimatch.filter(match);
}

FsQuery.prototype.filter = function (sel, toSpawn) {
  var filter = getFilter(sel);
  if (!filter) return this;

  var newQuery = this._spawn(toSpawn);

  this.once('resolve', function (contexts) {
    filter(contexts, function (dirs) {
      newQuery._resolve(dirs);
    });
  });

  return newQuery;
};

FsQuery.prototype._spawn = function (toSpawn) {
  var newQuery = fsQuery();
  if (toSpawn === false) {
    newQuery._parent = this._parent;
  } else {
    newQuery._parent = this;
  }

  return newQuery;
};

FsQuery.prototype.children = function (sel) {
  // only use directory among current context
  var dirs = this.filter(':dir');
  var children = dirs._spawn(false);
  var filtered = children.filter(sel, false);

  dirs.once('resolve', function (contexts) {
    async.map(contexts, readdir, function (err, results) {
      if (err) console.error(err.stack);
      results = _.flatten(results);
      debug('results ' + results.length);
      children._resolve(results);
    });
  });

  return filtered;
};

FsQuery.prototype.sortBy = function (fn) {
  var sorted = this._spawn(false);
  this.once('resolve', function (contexts) {
    if (fn.length === 1) {
      sorted._resolve(_.sortBy(contexts, fn));
    } else {
      async.sortBy(contexts, fn, function (err, results) {
        sorted._resolve(results);
      });
    }
  });

  return sorted;
};

/**
 * each is async
 */

FsQuery.prototype.each = function (fn) {
  this.once('resolve', function (contexts) {
    async.forEach(contexts, fn, function (err) {
      if (err) console.error(err.stack);
      debug('each done');
    });
  });

  return this;
};

FsQuery.prototype.map = function (fn) {
  var mapped = this._spawn(false);
  this.once('resolve', function (contexts) {
    if (fn.length === 1) {
      mapped._resolve(contexts.map(fn));
    } else {
      async.map(contexts, fn, function (err, results) {
        if (err) console.error(err.stack);
        debug('map done');
        mapped._resolve(results);
      });
    }
  });

  return mapped;
};


FsQuery.prototype._resolve = function (contexts) {
  this.contexts = contexts;
  this.emit('resolve', contexts);
  return this;
}

FsQuery.prototype.end = function () {
  return this._parent;
}

FsQuery.prototype.get = function (fn) {
  debug('get');
  fn = fn || function () {};

  this.once('resolve', function (contexts) {
    fn(null, contexts);
  });

  var origin = this;
  while (origin._parent) {
    origin = origin._parent;
  }

  if (!origin.contexts) {
    origin.context = path.resolve('.');
  }

  origin.emit('resolve', origin.contexts);
};

// FsQuery.prototype.each = function (fn) {
//   this.forEach(fn, this);
//   return this;
// };

// FsQuery.prototype.map = function (fn) {
//   this.map(fn, this);
//   return this;
// };

