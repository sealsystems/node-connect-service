'use strict';

const assert = require('assertthat');
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

let errIsLocal;

const getProtocol = proxyquire('../lib/getProtocol', {
  async './isLocal' (targetHost) {
    if (errIsLocal) {
      throw errIsLocal;
    }

    return targetHost === 'foo.node.dc1.consul';
  }
});

suite('getProtocol', () => {
  setup(() => {
    errIsLocal = null;
  });

  test('is a function.', async () => {
    assert.that(getProtocol).is.ofType('function');
  });

  test('throws an error if options are missing.', async () => {
    await assert.that(async () => {
      await getProtocol();
    }).is.throwingAsync('Options are missing.');
  });

  test('returns an error if isLocal failed.', async () => {
    errIsLocal = new Error('foo');

    await assert.that(async () => {
      await getProtocol({});
    }).is.throwingAsync('foo');
  });

  suite('with TLS_UNPROTECTED set to \'none\'', async () => {
    test('returns \'https\'.', async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'none');
      const protocol = await getProtocol({ name: 'foo.node.dc1.consul' });

      assert.that(protocol).is.equalTo('https');
      restore();
    });
  });

  suite('with TLS_UNPROTECTED set to \'world\'', async () => {
    test('returns \'http\'.', async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'world');
      const protocol = await getProtocol({ name: 'foo.node.dc1.consul' });

      assert.that(protocol).is.equalTo('http');
      restore();
    });
  });

  suite('with TLS_UNPROTECTED set to \'loopback\'', async () => {
    test('returns \'http\' if target is the same host.', async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
      const protocol = await getProtocol({ name: 'foo.node.dc1.consul' });

      assert.that(protocol).is.equalTo('http');
      restore();
    });

    test('returns \'https\' if target is another host.', async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
      const protocol = await getProtocol({ name: 'other-host.node.dc1.consul' });

      assert.that(protocol).is.equalTo('https');
      restore();
    });
  });

  suite('with TLS_UNPROTECTED set to an unknown value', async () => {
    test('returns an error.', async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'foobar');

      await assert.that(async () => {
        await getProtocol({ name: 'foo.node.dc1.consul' });
      }).is.throwingAsync('TLS_UNPROTECTED invalid.');

      restore();
    });
  });
});
