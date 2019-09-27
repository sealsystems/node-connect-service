'use strict';

const http = require('http');
const https = require('https');

const assert = require('assertthat');

const getDefaultAgent = require('../lib/getDefaultAgent');

suite('getDefaultAgent', () => {
  test('is a function', async () => {
    assert.that(getDefaultAgent).is.ofType('function');
  });

  test('throws an error if protocol is missing.', async () => {
    assert
      .that(() => {
        getDefaultAgent();
      })
      .is.throwing('Protocol is missing.');
  });

  test('returns the http agent.', async () => {
    assert.that(getDefaultAgent('http')).is.instanceOf(http.Agent);
  });

  test('returns the https agent.', async () => {
    assert.that(getDefaultAgent('https')).is.instanceOf(https.Agent);
  });

  test('returns undefined if protocol is unknown.', async () => {
    assert.that(getDefaultAgent('foobar')).is.undefined();
  });
});
