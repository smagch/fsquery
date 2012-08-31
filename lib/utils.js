var fs = require('fs')
  , path = require('path');

exports.isDirectory = function (name, done) {
  fs.stat(name, function (err, stat) {
    if (err) return done(false);
    done(stat.isDirectory());
  });
}

exports.isFile = function (name, done) {
  fs.stat(name, function (err, stat) {
    if (err) return done(false);
    done(stat.isFile());
  });
}

exports.readdir = function (name, done) {
  fs.readdir(name, function (err, results) {
    if (err) return done(err);
    done(null, results.map(function (result) {
      return path.resolve(name, result);
    }));
  });
}