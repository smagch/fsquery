

var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , _ = require('underscore')
  , EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits
  , mimimatch = require('minimatch')
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
  if (typeof name !== 'string') return null;
  var filterName = getMatch(name)[1];
  return {
    file: isFile
  , dir: isDirectory
  }[filterName];
}

FsQuery.prototype.filter = function (sel) {
  var filter = getFilter(sel);
  if (!filter) return this;

  var newQuery = this._spawn();

  this.on('resolve', function (contexts) {
    async.filter(contexts, filter, function (dirs) {
      newQuery._resolve(dirs);
    });
  });

  return newQuery;
};

FsQuery.prototype._spawn = function () {
  var newQuery = fsQuery();
  newQuery._parent = this;
  return newQuery;
};

FsQuery.prototype.children = function (sel) {
  // only use directory among current context
  var dirs = this.filter(':dir');
  var newQuery = dirs._spawn();

  dirs.once('resolve', function (contexts) {
    async.map(contexts, readdir, function (err, results) {
      if (err) console.error(err.stack);
      results = _.flatten(results);
      debug('results ' + results);
      newQuery._resolve(results);
    });
  });

  return newQuery;
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
