'use strict';

const assert = require('assertthat');

let errGetHostname;
const consul = {
  async getHostname() {
    if (errGetHostname) {
      throw errGetHostname;
    }

    return 'foo.node.dc1.consul';
  }
};

const isLocal = require('../lib/isLocal');

suite('isLocal', () => {
  setup(async () => {
    errGetHostname = null;
  });

  test('is a function', async () => {
    assert.that(isLocal).is.ofType('function');
  });

  test('throws an error if consul is missing.', async () => {
    await assert
      .that(async () => {
        await isLocal();
      })
      .is.throwingAsync('Consul is missing.');
  });

  test('throws an error if hostname is missing.', async () => {
    await assert
      .that(async () => {
        await isLocal(consul);
      })
      .is.throwingAsync('Hostname is missing.');
  });

  test('returns true if target host is "127.0.0.1".', async () => {
    const isLocalhost = await isLocal(consul, '127.0.0.1');

    assert.that(isLocalhost).is.equalTo(true);
  });

  test('returns true if target host is literally "localhost".', async () => {
    const isLocalhost = await isLocal(consul, 'localhost');

    assert.that(isLocalhost).is.equalTo(true);
  });

  test('returns true if target host is the local host.', async () => {
    const isLocalhost = await isLocal(consul, 'foo.node.dc1.consul');

    assert.that(isLocalhost).is.equalTo(true);
  });

  test('returns false if target host is not the local host.', async () => {
    const isLocalhost = await isLocal(consul, 'other-host.node.dc1.consul');

    assert.that(isLocalhost).is.equalTo(false);
  });

  test('returns an error if getting local hostname from consul failed.', async () => {
    errGetHostname = new Error('foobar');

    await assert
      .that(async () => {
        await isLocal(consul, 'target.node.dc1.consul');
      })
      .is.throwingAsync('foobar');
  });
});
