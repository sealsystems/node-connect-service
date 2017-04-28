'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let errLookup;
let errIsLocal;

const lookup = proxyquire('../lib/lookup', {
  './isLocal' (targethost, callback) {
    callback(errIsLocal, targethost === 'foo.node.dc1.consul');
  },
  '@sealsystems/seal-consul': {
    lookup (host, callback) {
      callback(errLookup, '1.2.3.4');
    }
  }
});

suite('lookup', () => {
  setup(() => {
    errIsLocal = null;
    errLookup = null;
  });

  test('is a function', (done) => {
    assert.that(lookup).is.ofType('function');
    done();
  });

  test('throws an error if hostname is missing.', (done) => {
    assert.that(() => {
      lookup();
    }).is.throwing('Hostname is missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      lookup('foo');
    }).is.throwing('Callback is missing.');
    done();
  });

  test('uses seal-consul to lookup ip address.', (done) => {
    lookup('foo', (err, ip) => {
      assert.that(err).is.falsy();
      assert.that(ip).is.equalTo('1.2.3.4');
      done();
    });
  });

  test('looks up ip address.', (done) => {
    lookup('target.node.dc1.consul', (err, ip) => {
      assert.that(err).is.falsy();
      assert.that(ip).is.equalTo('1.2.3.4');
      done();
    });
  });

  test('replaces ip address with 127.0.0.1 if target is the same host.', (done) => {
    lookup('foo.node.dc1.consul', (err, ip) => {
      assert.that(err).is.falsy();
      assert.that(ip).is.equalTo('127.0.0.1');
      done();
    });
  });

  test('returns an error if testing for localhost failed.', (done) => {
    errIsLocal = new Error('foobar');
    lookup('target.node.dc1.consul', (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.equalTo('foobar');
      done();
    });
  });

  test('returns an error if consul failed to look up the ip.', (done) => {
    errLookup = new Error('foobar');
    lookup('target.node.dc1.consul', (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.equalTo('foobar');
      done();
    });
  });
});
