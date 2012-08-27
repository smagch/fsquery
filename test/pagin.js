var expect = require('expect.js')
var pagin = require('../');
var options = {
  dirname: 'fixtures/case1'
, glob: {
    cwd: __dirname
  }
};

var Pagin = pagin.create(options);

describe('pagin', function () {
  return
  describe('.list()', function () {
    it('should find all documents with "*"', function (done) {
      Pagin.list('*', function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(3)
        expect(results[0].content).not.to.be.ok()
        expect(results[1].content).not.to.be.ok()
        expect(results[2].content).not.to.be.ok()
        done()
      })
    })

    it('should find all documents with "*": advanced query', function (done) {
      Pagin
        .list('*')
        .exec(function (err, results) {
          if (err) return done(err)
          expect(results).to.have.length(3)
          expect(results[0].content).not.to.be.ok()
          expect(results[1].content).not.to.be.ok()
          expect(results[2].content).not.to.be.ok()
          done()
        })
    })

    it('should be able to find by name', function (done) {
      Pagin.list('hoge', function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).not.to.be.ok()
        done()
      })
    })

    it('should be able to find by name: advanced query', function (done) {
      Pagin
        .list('hoge')
        .exec(function (err, results) {
          if (err) return done(err)
          expect(results).to.have.length(1)
          expect(results[0].content).not.to.be.ok()
          done()
        })
    })

    it('should be able to query with date year', function (done) {
      Pagin.list({date: '2011'}, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(2)
        expect(results[0].content).not.to.be.ok()
        expect(results[1].content).not.to.be.ok()
        done()
      })
    })

    it('should be able to query with date year: advanced query', function (done) {
      Pagin
        .list({date: '2011'})
        .exec(function (err, results) {
          if (err) return done(err)
          expect(results).to.have.length(2)
          expect(results[0].content).not.to.be.ok()
          expect(results[1].content).not.to.be.ok()
          done()
        })
    })

    it('should be able to query with date month', function (done) {
      Pagin.list({date: '2011-01'}, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).not.to.be.ok()
        done()
      })
    })

    it('should be able to query with date month: advanced query', function (done) {
      Pagin
        .list({date: '2011-01'})
        .exec(function (err, results) {
          if (err) return done(err)
          expect(results).to.have.length(1)
          expect(results[0].content).not.to.be.ok()
          done()
        })
    })

    it('should be able to query with date string', function (done) {
      Pagin.list({date: '2011-02-02'}, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).not.to.be.ok()
        done()
      })
    })

    it('should be able to query with date string: advanced query', function (done) {
      Pagin
        .list({date: '2011-02-02'})
        .exec(function (err, results) {
          if (err) return done(err)
          expect(results).to.have.length(1)
          expect(results[0].content).not.to.be.ok()
          done()
        })
    })
  })

  describe('.find()', function () {
    it('should find all documents with "*"', function (done) {
      Pagin.find('*', function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(3)
        expect(results[0].content).to.be.ok()
        expect(results[1].content).to.be.ok()
        expect(results[2].content).to.be.ok()
        done()
      })
    })

    it('should find all documents with "*": advanced query', function (done) {
      Pagin.find('*').exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(3)
        expect(results[0].content).to.be.ok()
        expect(results[1].content).to.be.ok()
        expect(results[2].content).to.be.ok()
        done()
      })
    })

    it('should be able to find by name', function (done) {
      Pagin.find('hoge', function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        done()
      })
    })

    it('should be able to find by name: advanced query', function (done) {
      Pagin.find('hoge').exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date year', function (done) {
      Pagin.find({date: '2011'}, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(2)
        expect(results[0].content).to.be.ok()
        expect(results[1].content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date year: advanced query', function (done) {
      Pagin.find({date: '2011'}).exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(2)
        expect(results[0].content).to.be.ok()
        expect(results[1].content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date month', function (done) {
      Pagin.find({date: '2011-01'}, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date month: advanced query', function (done) {
      Pagin.find({date: '2011-01'}).exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date string', function (done) {
      Pagin.find({date: '2011-02-02'}, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date string: advanced query', function (done) {
      Pagin.find({date: '2011-02-02'}).exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        done()
      })
    })

    it('should mutate with options.fn', function (done) {
      var prefix = 'successfully mutated';
      function fn(content) {
        return prefix + content.toString()
      }

      Pagin.find({
        name: 'hoge'
      , fn: fn
      }, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        var str = results[0].content.toString();
        expect(str.slice(0, prefix.length)).to.eql(prefix)
        done()
      })
    })

    it('should mutate with options.fn: advanced query', function (done) {
      var prefix = 'successfully mutated';
      function fn(content) {
        return prefix + content.toString()
      }

      Pagin.find({
        name: 'hoge'
      , fn: fn
      }).exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        var str = results[0].content.toString();
        expect(str.slice(0, prefix.length)).to.eql(prefix)
        done()
      })
    })

    it('should mutate asynchronouslly with options.fn arity 2', function (done) {
      var prefix = 'successfully mutated';
      function fn(content, done) {
        var ret = prefix + content.toString();
        process.nextTick(function () {
          done(null, ret);
        });
      }

      Pagin.find({
        name: 'hoge'
      , fn: fn
      }, function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        var str = results[0].content.toString();
        expect(str.slice(0, prefix.length)).to.eql(prefix)
        done()
      })
    })

    it('should mutate asynchronouslly with options.fn arity 2: advanced query', function (done) {
      var prefix = 'successfully mutated';
      function fn(content, done) {
        var ret = prefix + content.toString();
        process.nextTick(function () {
          done(null, ret);
        });
      }

      Pagin.find({
        name: 'hoge'
      , fn: fn
      }).exec(function (err, results) {
        if (err) return done(err)
        expect(results).to.have.length(1)
        expect(results[0].content).to.be.ok()
        var str = results[0].content.toString();
        expect(str.slice(0, prefix.length)).to.eql(prefix)
        done()
      })
    })
  })

  describe('.findOnly()', function () {
    it('should fail with multiple results', function (done) {
      Pagin.findOnly('*', function (err, results) {
        expect(err).to.be.ok()
        done()
      })
    })

    it('should fail with multiple results: advanced query', function (done) {
      Pagin.findOnly('*').exec(function (err, results) {
        expect(err).to.be.ok()
        done()
      })
    })

    it('should be able to find by name', function (done) {
      Pagin.findOnly('hoge', function (err, result) {
        if (err) return done(err)
        expect(result).to.be.ok()
        expect(result.content).to.be.ok()
        done()
      })
    })

    it('should be able to find by name: advanced query', function (done) {
      Pagin.findOnly('hoge').exec(function (err, result) {
        if (err) return done(err)
        expect(result).to.be.ok()
        expect(result.content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date month', function (done) {
      Pagin.findOnly({date: '2011-01'}, function (err, result) {
        if (err) return done(err)
        expect(result).to.be.ok()
        expect(result.content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date month: advanced query', function (done) {
      Pagin.findOnly({date: '2011-01'}).exec(function (err, result) {
        if (err) return done(err)
        expect(result).to.be.ok()
        expect(result.content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date string', function (done) {
      Pagin.findOnly({date: '2011-02-02'}, function (err, result) {
        if (err) return done(err)
        expect(result).to.be.ok()
        expect(result.content).to.be.ok()
        done()
      })
    })

    it('should be able to query with date string: advanced query', function (done) {
      Pagin.findOnly({date: '2011-02-02'}).exec(function (err, result) {
        if (err) return done(err)
        expect(result).to.be.ok()
        expect(result.content).to.be.ok()
        done()
      })
    })

  })
})