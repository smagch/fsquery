var fsQuery = require('../lib/fsquery')
  , FsQuery = fsQuery.FsQuery
  , path = require('path')
  , expect = require('expect.js')

describe('fsQuery', function () {
  var testDir = path.resolve(__dirname, 'fixtures2');

  describe('(options)', function () {
    it('should return FsQuery Object', function (done) {
      expect(fsQuery({})).to.be.a(FsQuery)
      done()
    })
  })

  describe('.children()', function () {
    it("should success", function (done) {
      fsQuery({cwd: testDir})
      .children()
      .get(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(6);
        done()
      })
    })

    it('should be able to do recursively', function (done) {
      fsQuery({cwd: testDir})
      .children()
      .children()
      .get(function (err, results) {
        if (err) return done(err);
        expect(results).to.have.length(6);
        done()
      })
    })

    it('should be able to do triple recursively', function (done) {
      fsQuery({cwd: testDir})
      .children()
      .children()
      .children()
      .get(function (err, results) {
        if (err) return done(err);
        expect(results).to.have.length(3);
        done()
      })
    })

    describe('with :', function () {
      it('should return only file with :file', function (done) {
        fsQuery({cwd: testDir})
        .children(':file')
        .get(function (err, results) {
          if (err) return done(err)
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
          expect(results).to.have.length(3)
          var basenames = results.map(function (result) {
            return path.basename(result)
          })
          expect(basenames).to.eql(['hoge1', 'hoge2', 'hoge3'])
          done()
        })
      })
    })

    // describe('with selector', function () {
    //   it('should ')
    // })
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
  // 
  // describe('.each()', function () {
  //   
  // })
  // 
  // describe('.map()', function () {
  //   
  // })
  // 
  // describe('.filter()', function () {
  //   
  // })
  // 
  // describe('.length()', function () {
  //   
  // })
  // 
  // describe('.sort()', function () {
  //   
  // })
  // 
  // describe('.sortBy()', function () {
  //   
  // })
  // 
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
  // 
  // describe(':attribute', function () {
  //   it('should match only directory with :dir', function (done) {
  //     var ret = fsQuery('fixtures2')
  //       .children(':dir')
  //       .length()
  // 
  //     //expect()
  //     done()
  //   })
  // 
  //   it('should match only files with :file', function (done) {
  //     var ret = fsQuery('fixtures2')
  //       .children(':file')
  //       .length()
  // 
  //     done()
  //   })
  // })

  
})