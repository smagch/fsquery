var glob = require('glob')
  , path = require('path')
  , _ = require('underscore')
  , utils = require('./utils')
  , debug = utils.debug;

module.exports = Query;

/**
 * Constructor
 *
 * @param {Object|Array|String}
 */

function Query(options) {
  this.options = utils.options(options);
}

/**
 * return glob minimatch string
 * `{dirname}/{date}-{name}{extname}`
 *
 * @param {Object} - optional
 * @return {String}
 */

Query.prototype.getMatcher = function (options) {
  options = options || this.options;
  var ret = options.dirname + path.sep + options.date + '-' + options.name + options.extname;
  debug('matcher : ' + ret);
  return ret;
};

/**
 * execute query
 *
 * @param {Function}
 */

Query.prototype.exec = function (callback) {
  var matcher = this.getMatcher()
    , options = this.options
    , done = options._callback
           ? options._callback(callback)
           : callback;

  glob(matcher, options.glob, function (err, results) {
    if (err) return done(err);

    var ret = results.map(function (name) {
      var obj = {}
        , filepath = path.resolve(options.glob.cwd, name)
        , base = path.basename(name)
        , match = options.format.exec(base)

      if (!match || !match[1] || !match[2]) {
        throw new Error('invalid filename : ' + name);
      }

      return {
        name: match[2]
      , title: match[2].replace(/\-/g, ' ')
      , filepath: filepath
      , date: match[1]
      };
    });

    done(null, ret, options);
  });

  return this;
};