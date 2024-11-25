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

  test('returns the http agent with keepAlive set to true.', async () => {
    const agent = getDefaultAgent('http');
    assert.that(agent).is.instanceOf(http.Agent);
    assert.that(agent.keepAlive).is.true();
  });

  test('returns the https agent with keepAlive set to true.', async () => {
    const agent = getDefaultAgent('https');
    assert.that(agent).is.instanceOf(https.Agent);
    assert.that(agent.keepAlive).is.true();
  });

  test('returns the http agent with keepAlive set to false.', async () => {
    const agent = getDefaultAgent('http', false);
    assert.that(agent).is.instanceOf(http.Agent);
    assert.that(agent.keepAlive).is.false();
  });

  test('returns the https agent with keepAlive set to false.', async () => {
    const agent = getDefaultAgent('https', false);
    assert.that(agent).is.instanceOf(https.Agent);
    assert.that(agent.keepAlive).is.false();
  });

  test('returns undefined if protocol is unknown.', async () => {
    assert.that(getDefaultAgent('foobar')).is.undefined();
  });
});
