var fsQuery = require('../')
  , FsQuery = fsQuery.FsQuery
  , path = require('path')
  , expect = require('expect.js')

describe('fsQuery', function () {
  var testDir = path.resolve(__dirname, 'fixtures2');

  describe('(options)', function () {
    it('should return FsQuery Object', function (done) {
      expect(fsQuery()).to.be.a(FsQuery)
      done()
    })
  })

  describe('.children()', function () {
    it("should success", function (done) {
      fsQuery(testDir)
      .children()
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(6)
        done()
      })
    })

    it('should be able to do recursively', function (done) {
      fsQuery(testDir)
      .children()
      .children()
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(6)
        done()
      })
    })

    it('should be able to do triple recursively', function (done) {
      fsQuery(testDir)
      .children()
      .children()
      .children()
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(3)
        done()
      })
    })

    describe('with :', function () {
      it('should return only file with :file', function (done) {
        fsQuery(testDir)
        .children(':file')
        .get(function (err, results) {
          if (err) return done(err)
          expect(results).to.be.ok()
          expect(results).to.have.length(3)
          var basenames = results.map(function (result) {
            return path.basename(result)
          })
          expect(basenames).to.eql(['hoge1.txt', 'hoge2.txt', 'hoge3.txt'])
          done()
        })
      })

      it('should return only directory with :dir', function (done) {
        fsQuery(testDir)
        .children(':dir')
        .get(function (err, results) {
          if (err) done(err)
          expect(results).to.be.ok()
          expect(results).to.have.length(3)
          var basenames = results.map(function (result) {
            return path.basename(result)
          })
          expect(basenames).to.eql(['hoge1', 'hoge2', 'hoge3'])
          done()
        })
      })
    })
  })

  describe('.filter()', function () {
    it('should filter directories with :dir', function (done) {
      fsQuery(testDir)
      .children()
      .filter(':dir')
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(3)
        var basenames = results.map(function (result) {
          return path.basename(result)
        })
        expect(basenames).to.eql(['hoge1', 'hoge2', 'hoge3'])
        done()
      })
    })

    it('should filter files with :file', function (done) {
      fsQuery(testDir)
      .children()
      .filter(':file')
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(3)
        var basenames = results.map(function (results) {
          return path.basename(results)
        })
        expect(basenames).to.eql(['hoge1.txt', 'hoge2.txt', 'hoge3.txt'])
        done()
      })
    })

    describe('with minimatch', function () {
      it('should return minimatched files', function (done) {
        fsQuery(testDir)
        .children()
        .filter('hoge1*')
        .get(function (err, results) {
          if (err) return done(err)
          expect(results).to.be.ok()
          expect(results).to.have.length(2)
          done()
        })
      })
    })

    describe('with both minimatch and filter', function () {
      it('should success', function (done) {
        fsQuery(testDir)
        .children()
        .filter('hoge2*:file')
        .get(function (err, results) {
          if (err) return done(err)
          expect(results).to.be.ok()
          expect(results).to.have.length(1)
          expect(path.basename(results[0])).to.eql('hoge2.txt')
          done()
        })
      })
    })
  })

  describe('.each()', function () {
    it('should success', function (done) {
      var filenames = [];
      fsQuery(testDir)
      .children()
      .each(function (name, done) {
        filenames.push(name);
        process.nextTick(done);
      })
      .get(function (err, results) {
        if (err) return done(err);
        expect(filenames).to.have.length(6);
        done();
      })
    })
  })

  describe('.map()', function () {
    it('should success', function (done) {
      fsQuery(testDir)
      .children()
      .map(function (name, done) {
        process.nextTick(function () {
          done(null, path.basename(name));
        });
      })
      .get(function (err, results) {
        if (err) return done(err);
        expect(results).to.be.ok();
        expect(results).to.eql(['hoge1', 'hoge1.txt', 'hoge2', 'hoge2.txt', 'hoge3', 'hoge3.txt']);
        done();
      });
    })

    it('should step synchronously', function (done) {
      fsQuery(testDir).children(':dir')
      .map(function (filename, next) {
        process.nextTick(function () {
          next(null, path.basename(filename))
        }) 
      })
      .map(function (filename, next) {
        process.nextTick(function () {
          next(null, filename + '-h')
        })
      })
      .map(function (filename, next) {
        process.nextTick(function () {
          next(null, filename + 'el')
        })
      })
      .map(function (filename, next) {
        process.nextTick(function () {
          next(null, filename + 'lo')
        })
      })
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(3)
        expect(results).to.eql(['hoge1-hello', 'hoge2-hello', 'hoge3-hello']);
        done()
      })
    })

    it('should works synchronousely with arity 1', function (done) {
      fsQuery(testDir).children(':file')
      .map(function (filename) {
        return path.basename(filename, '.txt') + '.poo'
      })
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.be.ok()
        expect(results).to.have.length(3)
        expect(results).to.eql(['hoge1.poo', 'hoge2.poo', 'hoge3.poo'])
        done()
      })
    })
  })

  describe('.sortBy()', function () {
    it('should sort synchronously with arity 1', function (done) {
      fsQuery(testDir).children()
      .map(function (filename, next) {
        next(null, path.basename(filename))
      })
      .sortBy(function (filename) {
        var match = /^hoge(\d)(.*)/.exec(filename);
        return -100 * match[1] + match[2].length;
      })
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(6)
        expect(results).to.eql(['hoge3', 'hoge3.txt', 'hoge2', 'hoge2.txt', 'hoge1', 'hoge1.txt'])
        done()
      })
    })

    it('should sort asynchronous with arity 2', function (done) {
      fsQuery(testDir).children()
      .map(function (filename, next) {
        next(null, path.basename(filename))
      })
      .sortBy(function (filename, next) {
        var match = /^hoge(\d)(.*)/.exec(filename);
        process.nextTick(function () {
          next(null, -100 * match[1] + match[2].length)
        })
      })
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(6)
        expect(results).to.eql(['hoge3', 'hoge3.txt', 'hoge2', 'hoge2.txt', 'hoge1', 'hoge1.txt'])
        done()
      })
    })
  })

  // describe('.parent()', function () {
  //   
  // })
  // 
  // describe('.find()', function () {
  //   it("should match files recursively", function (done) {
  //     
  //   })
  // })

  // describe('.groupBy()', function () {
  //   
  // })
  // 
  // describe('.get()', function () {
  //   
  // })
  // 
  // describe('.read()', function () {
  //   it('should error without callback', function (done) {
  //     
  //     done()
  //   })
  // 
  //   it('should read specific prop if first argument is a String', function (done) {
  //     fsQuery('fixtures2')
  //       .map(function () {
  //         return {
  //           filename: this
  //         }
  //       })
  //       .read('filename', function (err, body) {
  //         if (err) done(err)
  //         expect(body).to.be.a('buffer')
  //         done()
  //       })
  //   })
  // })

})