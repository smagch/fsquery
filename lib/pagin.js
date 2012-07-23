var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , Query = require('./query')
  , utils = require('./utils')
  , debug = utils.debug

exports.create = function (options) {
  return new Pagin(options);
};

/**
 * @api private
 */

function readFile(obj, done) {
  fs.readFile(obj.filepath, function (err, content) {
    if (err) return done(err);
    obj.content = content;
    done(null, obj);
  });
}

/**
 * @api private
 */

function mutate(fn, done) {
  return function (err, obj) {
    if (err) return done(err);

    var content = obj.content;

    if (fn.length === 1) {
      obj.content = fn(content);
      done(null, obj);
    } else {
      fn(content, function (err, _content) {
        obj.content = _content
        done(err, obj);
      })
    }

  };
}

/**
 * Constructor
 *
 * @param {Object|String}
 */

function Pagin(options) {
  this.options = utils.options(options);
}

Pagin.prototype.list = function (options, done) {
  return this._query(options, done);
};

/**
 * find documents
 *
 * @param {String|Object}
 * @param {Function}
 */

Pagin.prototype.find = function (options, done) {
  return this._query(options, function (err, results, _options) {
    debug('find query callback')

    if (err) return done(err);
    // TODO consider limit
    // TODO paging by offset
    if (typeof _options.fn !== 'function') {
      async.map(results, readFile, done);
    } else {
      async.map(results, function (obj, next) {
        readFile(obj, mutate(_options.fn, next));
      }, done);
    }
  });
};

/**
 * find one document
 *
 * @param {String|Object}
 * @param {Function}
 */

// Pagin.prototype.fineOne = function (options, done) {
//   return this._query(options, function (err, results, _options) {
//     if (err) return done(err);
//     // TODO error opiton
//     if (!results.length) {
//       return done(null, []);
//     }
//     // TODO offset
//     if (typeof _options.fn !== 'function') {
//       readFile(results[0], done);
//     } else {
//       readFile(results[0], mutate(done));
//     }
//   });
// };

/**
 * query counts
 *
 * @param {String|Object}
 * @param {Function}
 */

// Pagin.prototype.count = function (options, done) {
//   return this._query(options, function (err, results) {
//     if (err) return done(err);
//     done(null, results.length);
//   });
// };

/**
 * exec query
 *
 * @api private
 */

Pagin.prototype._query = function (options, done) {
  if (typeof options === 'string') {
    options = {
      name: options
    };
  }

  var query = new Query([this.options, options]);
  if (!done) return query;
  debug('_query')
  query.exec(done);
};
