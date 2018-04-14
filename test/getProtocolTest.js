'use strict';

const assert = require('assertthat');
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

let errIsLocal;

const getProtocol = proxyquire('../lib/getProtocol', {
  './isLocal' (targetHost, callback) {
    callback(errIsLocal, targetHost === 'foo.node.dc1.consul');
  }
});

suite('getProtocol', () => {
  setup(() => {
    errIsLocal = null;
  });

  test('is a function.', (done) => {
    assert.that(getProtocol).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', (done) => {
    assert.that(() => {
      getProtocol();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      getProtocol({});
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns an error if isLocal failed.', (done) => {
    errIsLocal = new Error('foo');
    getProtocol({}, (err) => {
      assert.that(err).is.not.null();
      assert.that(err.message).is.equalTo('foo');
      done();
    });
  });

  suite('with TLS_UNPROTECTED set to \'none\'', () => {
    test('returns \'https\'.', (done) => {
      const restore = nodeenv('TLS_UNPROTECTED', 'none');

      getProtocol({ name: 'foo.node.dc1.consul' }, (err, protocol) => {
        assert.that(err).is.falsy();
        assert.that(protocol).is.equalTo('https');
        restore();
        done();
      });
    });
  });

  suite('with TLS_UNPROTECTED set to \'world\'', () => {
    test('returns \'http\'.', (done) => {
      const restore = nodeenv('TLS_UNPROTECTED', 'world');

      getProtocol({ name: 'foo.node.dc1.consul' }, (err, protocol) => {
        assert.that(err).is.falsy();
        assert.that(protocol).is.equalTo('http');
        restore();
        done();
      });
    });
  });

  suite('with TLS_UNPROTECTED set to \'loopback\'', () => {
    test('returns \'http\' if target is the same host.', (done) => {
      const restore = nodeenv('TLS_UNPROTECTED', 'loopback');

      getProtocol({ name: 'foo.node.dc1.consul' }, (err, protocol) => {
        assert.that(err).is.falsy();
        assert.that(protocol).is.equalTo('http');
        restore();
        done();
      });
    });

    test('returns \'https\' if target is another host.', (done) => {
      const restore = nodeenv('TLS_UNPROTECTED', 'loopback');

      getProtocol({ name: 'other-host.node.dc1.consul' }, (err, protocol) => {
        assert.that(err).is.falsy();
        assert.that(protocol).is.equalTo('https');
        restore();
        done();
      });
    });
  });

  suite('with TLS_UNPROTECTED set to an unknown value', () => {
    test('returns an error.', (done) => {
      const restore = nodeenv('TLS_UNPROTECTED', 'foobar');

      getProtocol({ name: 'foo.node.dc1.consul' }, (err) => {
        assert.that(err).is.not.falsy();
        assert.that(err.message).is.equalTo('TLS_UNPROTECTED invalid.');
        restore();
        done();
      });
    });
  });
});
