'use strict';

const assert = require('assertthat');
const nodeenv = require('nodeenv');

const getCiphers = require('../lib/getCiphers');

suite('getCiphers', () => {
  test('is a function', (done) => {
    assert.that(getCiphers).is.ofType('function');
    done();
  });

  test('returns by default an empty string.', (done) => {
    assert.that(getCiphers()).is.equalTo('');
    done();
  });

  test('returns the contents of the environment variable TLS_CIPHERS.', (done) => {
    nodeenv('TLS_CIPHERS', 'foobar', (restore) => {
      assert.that(getCiphers()).is.equalTo('foobar');
      restore();
      done();
    });
  });

  // Note: Depends on test above!
  test('caches the contents of TLS_CIPHERS.', (done) => {
    assert.that(getCiphers()).is.equalTo('foobar');
    done();
  });
});
