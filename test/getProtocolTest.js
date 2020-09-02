'use strict';

const assert = require('assertthat');
const { nodeenv } = require('nodeenv');
const proxyquire = require('proxyquire');

let errIsLocal;

const consul = {};
const getProtocol = proxyquire('../lib/getProtocol', {
  async './isLocal'(localconsul, targetHost) {
    if (errIsLocal) {
      throw errIsLocal;
    }

    return targetHost === 'foo.node.dc1.consul';
  }
});

suite('getProtocol', () => {
  setup(async () => {
    errIsLocal = null;
  });

  test('is a function.', async () => {
    assert.that(getProtocol).is.ofType('function');
  });

  test('throws an error if consul is missing.', async () => {
    const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
    await assert
      .that(async () => {
        await getProtocol();
      })
      .is.throwingAsync('Consul is missing.');
    restore();
  });

  test('throws an error if host is missing.', async () => {
    const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
    await assert
      .that(async () => {
        await getProtocol(consul);
      })
      .is.throwingAsync('Host is missing.');
    restore();
  });

  test('returns an error if isLocal failed.', async () => {
    const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
    errIsLocal = new Error('foo');

    await assert
      .that(async () => {
        await getProtocol(consul, {});
      })
      .is.throwingAsync('foo');
    restore();
  });

  suite("with TLS_UNPROTECTED set to 'none'", () => {
    test("returns 'https'.", async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'none');
      const protocol = await getProtocol(consul, { name: 'foo.node.dc1.consul' });

      assert.that(protocol).is.equalTo('https');
      restore();
    });
  });

  suite("with TLS_UNPROTECTED set to 'world'", () => {
    test("returns 'http'.", async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'world');
      const protocol = await getProtocol(consul, { name: 'foo.node.dc1.consul' });

      assert.that(protocol).is.equalTo('http');
      restore();
    });
  });

  suite("with TLS_UNPROTECTED set to 'loopback'", () => {
    test("returns 'http' if target is the same host.", async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
      const protocol = await getProtocol(consul, { name: 'foo.node.dc1.consul' });

      assert.that(protocol).is.equalTo('http');
      restore();
    });

    test("returns 'https' if target is another host.", async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'loopback');
      const protocol = await getProtocol(consul, { name: 'other-host.node.dc1.consul' });

      assert.that(protocol).is.equalTo('https');
      restore();
    });
  });

  suite('with TLS_UNPROTECTED set to an unknown value', () => {
    test('returns an error.', async () => {
      const restore = nodeenv('TLS_UNPROTECTED', 'foobar');

      await assert
        .that(async () => {
          await getProtocol(consul, { name: 'foo.node.dc1.consul' });
        })
        .is.throwingAsync('TLS_UNPROTECTED invalid.');

      restore();
    });
  });
});
