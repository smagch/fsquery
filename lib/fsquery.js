

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
    .children() // context ['/tmp', ['hoge1', 'hoge2', 'hoge3']]
      .children() // context ['/tmp',
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
    options = { cwd: options  };
  }
  this.options = _.extend({}, defaults, options);
  this._id = 0;
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
  var filter = {
    file: isFile
  , dir: isDirectory
  }[filterName];
  return filter;
}

FsQuery.prototype.pushCallback = function () {
  var self = this;
  return function(err, results) {
    if (err) return self._abort(err);
    
  };
};

FsQuery.prototype.currentId = function () {
  return this._id;
};

FsQuery.prototype.nextId = function () {
  this._id++;
  return this._id;
};

// TODO start new fsQuery()
FsQuery.prototype.children = function (sel) {
  // should wait unitl it's contexts are resolved
  // var uid = this.getUid();
  var filter = getFilter(sel);
  // var matcher = getMatcher(sel);

  var self = this
    , id = this.currentId()
    , nextId = this.nextId()
    , dirname = this._dir
      ? this._dir
      : (this._dir = this.options.cwd)

  this.once('next' + id, function (contexts) {
    // make sure all contexts are directories
    debug('context : ' + contexts);
    async.filter(contexts, isDirectory, function (dirs) {
      debug('dirs : ' + dirs);
      async.map(dirs, readdir, function(err, results) {
        if (err) console.error(err.stack);
        debug('results ' + results);
        results = _.flatten(results);
        if (filter) {
          async.filter(results, filter, function (_dirs) {
            self.emit('next' + nextId, _dirs);
          });
        } else {
          self.emit('next' + nextId, results);
        }
      });
    });
  });

  // fs.stat(this.options.cwd, this.stack());
  // fs.stat(this, function (err, stat) {
  //   if (!stat.isDirectory()) {
  //     
  //   }
  // });

  // TODO start new FsQuery({
  //   sel: 'sel'
  // })
  // this.children.push(new FsQuery())
  return this;
};

// FsQuery.prototype.parent = function () {
// };
// FsQuery.prototype.end = function () {
// };
// FsQuery.prototype.find = function (name) {return this;};

FsQuery.prototype.get = function (fn) {
  // fs.stat()
  var uid = this.currentId();
  this.on('next' + uid, function (contexts) {
    return fn(null, contexts);
  });

  debug('this.options.cwd : ' + this.options.cwd);

  this.emit('next0', [this.options.cwd]);
};

// FsQuery.prototype.each = function (fn) {
//   this.forEach(fn, this);
//   return this;
// };

// FsQuery.prototype.map = function (fn) {
//   this.map(fn, this);
//   return this;
// };

FsQuery.prototype.filter = function (fn) {
  
  return this;
};


// FsQuery.prototype.get = function (fn) {
//   var self = this;
//   process.nextTick(function () {
//     self._exec();
//   });
// };


// FsQuery.prototype._exec = function () {
//   glob(this._matcher, function (err, results) {
//     results.
//   });
// 
//   forEach(function (obj) {
//     
//   }, this);
// };

