'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let errGetHostname;

const isLocal = proxyquire('../lib/isLocal', {
  'seal-consul': {
    getHostname (callback) {
      callback(errGetHostname, 'foo.node.dc1.consul');
    }
  }
});

suite('isLocal', () => {
  setup(() => {
    errGetHostname = null;
  });

  test('is a function', (done) => {
    assert.that(isLocal).is.ofType('function');
    done();
  });

  test('throws an error if hostname is missing.', (done) => {
    assert.that(() => {
      isLocal();
    }).is.throwing('Hostname is missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      isLocal('foo');
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns true if target host is the local host.', (done) => {
    isLocal('foo.node.dc1.consul', (err, isLocalhost) => {
      assert.that(err).is.falsy();
      assert.that(isLocalhost).is.equalTo(true);
      done();
    });
  });

  test('returns false if target host is not the local host.', (done) => {
    isLocal('other-host.node.dc1.consul', (err, isLocalhost) => {
      assert.that(err).is.falsy();
      assert.that(isLocalhost).is.equalTo(false);
      done();
    });
  });

  test('returns an error if getting local hostname from consul failed.', (done) => {
    errGetHostname = new Error('foobar');
    isLocal('target.node.dc1.consul', (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.equalTo('foobar');
      done();
    });
  });
});
