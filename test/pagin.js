var expect = require('expect.js')
var pagin = require('../');
var options = {
  dirname: 'fixtures/case1'
, glob: {
    cwd: __dirname
  }
};

var Pagin = pagin.create(options);

describe('pagin.find()', function () {

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

    // it('should mutate with options.fn', function (done) {
    //   
    // })
  })
})