'use strict';

const assert = require('assertthat');
const nock = require('nock');
const proxyquire = require('proxyquire');

let errLookup;
let lookupResult;
const connect = proxyquire('../lib/connect', {
  './lookup' (hostname, callback) {
    process.nextTick(() => {
      callback(errLookup, lookupResult);
    });
  }
});

suite('connect', () => {
  setup(() => {
    errLookup = null;
    lookupResult = '127.0.0.1';
  });

  test('is a function', (done) => {
    assert.that(connect).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', (done) => {
    assert.that(() => {
      connect();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if protocol is missing.', (done) => {
    assert.that(() => {
      connect({
      });
    }).is.throwing('Protocol is missing.');
    done();
  });

  test('throws an error if wrong protocol is given.', (done) => {
    assert.that(() => {
      connect({
        protocol: 'foo'
      });
    }).is.throwing('Wrong protocol is given: foo');
    done();
  });

  test('throws an error if service name is missing.', (done) => {
    assert.that(() => {
      connect({
        protocol: 'http'
      });
    }).is.throwing('Service name is missing.');
    done();
  });

  test('throws an error if host is missing.', (done) => {
    assert.that(() => {
      connect({
        protocol: 'http',
        service: 'foo'
      });
    }).is.throwing('Host is missing.');
    done();
  });

  test('throws an error if hostname is missing.', (done) => {
    assert.that(() => {
      connect({
        protocol: 'http',
        service: 'foo'
      }, {});
    }).is.throwing('Hostname is missing.');
    done();
  });

  test('throws an error if port is missing.', (done) => {
    assert.that(() => {
      connect({
        protocol: 'http',
        service: 'foo'
      }, {
        name: 'bar'
      });
    }).is.throwing('Port is missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      connect({
        protocol: 'http',
        service: 'foo'
      }, {
        name: 'bar',
        port: 3000
      });
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns an error if the DNS lookup failed.', (done) => {
    errLookup = new Error('foo');
    connect({
      protocol: 'http',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    }, (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.containing('foo');
      done();
    });
  });

  test('returns an error if wrong port is given.', (done) => {
    connect({
      protocol: 'http',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    }, (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.containing('ECONNREFUSED');
      done();
    });
  });

  test('returns a http client.', (done) => {
    const nockScope = nock('http://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

    connect({
      path: '/test/path',
      protocol: 'http',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    }, (err, client) => {
      assert.that(err).is.falsy();
      assert.that(client).is.ofType('object');
      client.once('response', (clientRes) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(clientRes.statusCode).is.equalTo(200);
        done();
      });
      client.end('huhu');
    });
  });

  test('returns a http client if ip address is used to connect.', (done) => {
    const nockScope = nock('http://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

    connect({
      path: '/test/path',
      protocol: 'http',
      service: 'test service'
    }, {
      name: '127.0.0.1',
      port: 3000
    }, (err, client) => {
      assert.that(err).is.falsy();
      assert.that(client).is.ofType('object');
      client.once('response', (clientRes) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(clientRes.statusCode).is.equalTo(200);
        done();
      });
      client.end('huhu');
    });
  });

  test('returns a https client.', (done) => {
    const nockScope = nock('https://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

    connect({
      path: '/test/path',
      protocol: 'https',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    }, (err, client) => {
      assert.that(err).is.falsy();
      assert.that(client).is.ofType('object');
      client.once('response', (clientRes) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(clientRes.statusCode).is.equalTo(200);
        done();
      });
      client.end('huhu');
    });
  });

  test('uses `/` if no path is given.', (done) => {
    const nockScope = nock('http://127.0.0.1:3000').post('/', 'huhu').reply(200);

    connect({
      protocol: 'http',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    }, (err, client) => {
      assert.that(err).is.falsy();
      assert.that(client).is.ofType('object');
      client.once('response', (clientRes) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(clientRes.statusCode).is.equalTo(200);
        done();
      });
      client.end('huhu');
    });
  });

  suite('client', () => {
    test('emits an error if wrong path is given.', (done) => {
      const nockScope = nock('http://127.0.0.1:3000').post('/expected/path', 'huhu').reply(200);

      connect({
        path: '/wrong/path',
        protocol: 'http',
        service: 'test service'
      }, {
        name: 'localhost',
        port: 3000
      }, (errRequest, client) => {
        assert.that(errRequest).is.falsy();
        client.once('error', (err) => {
          assert.that(err).is.not.null();
          assert.that(err.message).is.containing('No match for request');
          assert.that(nockScope.isDone()).is.false();
          nock.cleanAll();
          done();
        });
        client.end('huhu');
      });
    });

    test('contains a requestOptions object.', (done) => {
      nock('http://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

      connect({
        path: '/test/path',
        protocol: 'http',
        service: 'test service'
      }, {
        name: 'localhost',
        port: 3000
      }, (err, client) => {
        assert.that(err).is.falsy();
        assert.that(client.requestOptions).is.ofType('object');
        assert.that(client.requestOptions.proto).is.equalTo('http');
        assert.that(client.requestOptions.hostname).is.equalTo('127.0.0.1');
        assert.that(client.requestOptions.port).is.equalTo(3000);
        assert.that(client.requestOptions.path).is.equalTo('/test/path');
        nock.cleanAll();
        done();
      });
    });
  });
});
