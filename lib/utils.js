var _ = require('underscore')
  , path = require('path')

/**
 * query default options
 * query is performed by glob
 * `{dirname}/{date}-{name}{extname}` will be the first argument for glob
 *
 * ***WARN*** No streaming api, so let's set limit low to avoid stackoverflow
 */

var defaults = {
  dirname: 'posts'
, extname: '.md'
, format: /(\d{4}\-\d{2}\-\d{2})\-(.*)\.md/
, date: '*'
, name: '*'
, limit: 6
, offset: 0
, fn: null
, _callback: null
, glob: {
    cwd: path.dirname(require.main.filename)
  }
};

/**
 *
 * @param {Object|Array}
 * @return {Object}
 */

exports.options = function (options) {
  var args = [{}].concat(defaults, options);
  return _.extend.apply(null, args);
};

exports.debug = require('debug')('pagin');