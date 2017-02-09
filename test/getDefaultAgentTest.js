'use strict';

const http = require('http');
const https = require('https');

const assert = require('assertthat');

const getDefaultAgent = require('../lib/getDefaultAgent');

suite('getDefaultAgent', () => {
  test('is a function', (done) => {
    assert.that(getDefaultAgent).is.ofType('function');
    done();
  });

  test('throws an error if protocol is missing.', (done) => {
    assert.that(() => {
      getDefaultAgent();
    }).is.throwing('Protocol is missing.');
    done();
  });

  test('returns the http agent.', (done) => {
    assert.that(getDefaultAgent('http')).is.instanceOf(http.Agent);
    done();
  });

  test('returns the https agent.', (done) => {
    assert.that(getDefaultAgent('https')).is.instanceOf(https.Agent);
    done();
  });

  test('returns undefined if protocol is unknown.', (done) => {
    assert.that(getDefaultAgent('foobar')).is.undefined();
    done();
  });
});
