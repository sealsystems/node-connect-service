'use strict';

const assert = require('assertthat');
const nodeenv = require('nodeenv');

const getCiphers = require('../lib/getCiphers');

suite('getCiphers', () => {
  test('is a function', async () => {
    assert.that(getCiphers).is.ofType('function');
  });

  test('returns by default an empty string.', async () => {
    assert.that(getCiphers()).is.equalTo('');
  });

  test('returns the contents of the environment variable TLS_CIPHERS.', async () => {
    const restore = nodeenv('TLS_CIPHERS', 'foobar');

    assert.that(getCiphers()).is.equalTo('foobar');
    restore();
  });

  // Note: Depends on test above!
  test('caches the contents of TLS_CIPHERS.', async () => {
    assert.that(getCiphers()).is.equalTo('foobar');
  });
});
