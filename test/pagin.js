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

    it('should be able to find by name', function (done) {
      Pagin.list('hoge', function (err, results) {
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

    it('should be able to query with date month', function (done) {
      Pagin.list({date: '2011-01'}, function (err, results) {
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

    it('should be able to find by name', function (done) {
      Pagin.find('hoge', function (err, results) {
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

    it('should be able to query with date month', function (done) {
      Pagin.find({date: '2011-01'}, function (err, results) {
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
  })
})