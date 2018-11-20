
'use strict';

const assert = require('assertthat');
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

let errLookup;
let errIsLocal;

const lookup = proxyquire('../lib/lookup', {
  async './isLocal' (targethost) {
    if (errIsLocal) {
      throw errIsLocal;
    }

    return targethost === 'foo.node.dc1.consul';
  },
  '@sealsystems/consul': {
    async lookup () {
      if (errLookup) {
        throw errLookup;
      }

      return '1.2.3.4';
    }
  }
});

suite('lookup', () => {
  setup(() => {
    errIsLocal = null;
    errLookup = null;
  });

  test('is a function', async () => {
    assert.that(lookup).is.ofType('function');
  });

  test('throws an error if hostname is missing.', async () => {
    await assert.that(async () => {
      await lookup();
    }).is.throwingAsync('Hostname is missing.');
  });

  test('uses @sealsystems/consul to lookup ip address.', async () => {
    const ip = await lookup('foo');

    assert.that(ip).is.equalTo('1.2.3.4');
  });

  test('looks up ip address.', async () => {
    const ip = await lookup('target.node.dc1.consul');

    assert.that(ip).is.equalTo('1.2.3.4');
  });

  test('replaces ip address with 127.0.0.1 if target is the same host.', async () => {
    const ip = await lookup('foo.node.dc1.consul');

    assert.that(ip).is.equalTo('127.0.0.1');
  });

  test('throws an error if testing for localhost failed.', async () => {
    errIsLocal = new Error('foobar');

    await assert.that(async () => {
      await lookup('target.node.dc1.consul');
    }).is.throwingAsync('foobar');
  });

  test('throws an error if consul failed to look up the ip.', async () => {
    errLookup = new Error('foobar');

    await assert.that(async () => {
      await lookup('target.node.dc1.consul');
    }).is.throwingAsync('foobar');
  });

  suite('cloud service discovery', () => {
    test('directly uses service name.', async () => {
      const restore = nodeenv('SERVICE_DISCOVERY', 'cloud');
      const result = await lookup('bodyscanner');

      assert.that(result).is.equalTo('bodyscanner');
      restore();
    });
  });
});
