'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let errGetHostname;

const isLocal = proxyquire('../lib/isLocal', {
  '@sealsystems/consul': {
    async getHostname () {
      if (errGetHostname) {
        throw errGetHostname;
      }

      return 'foo.node.dc1.consul';
    }
  }
});

suite('isLocal', () => {
  setup(() => {
    errGetHostname = null;
  });

  test('is a function', async () => {
    assert.that(isLocal).is.ofType('function');
  });

  test('throws an error if hostname is missing.', async () => {
    await assert.that(async () => {
      await isLocal();
    }).is.throwingAsync('Hostname is missing.');
  });

  test('returns true if target host is the local host.', async () => {
    const isLocalhost = await isLocal('foo.node.dc1.consul');

    assert.that(isLocalhost).is.equalTo(true);
  });

  test('returns false if target host is not the local host.', async () => {
    const isLocalhost = await isLocal('other-host.node.dc1.consul');

    assert.that(isLocalhost).is.equalTo(false);
  });

  test('returns an error if getting local hostname from consul failed.', async () => {
    errGetHostname = new Error('foobar');

    await assert.that(async () => {
      await isLocal('target.node.dc1.consul');
    }).is.throwingAsync('foobar');
  });
});
