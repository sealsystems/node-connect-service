'use strict';

const assert = require('assertthat');
const nock = require('nock');
const proxyquire = require('proxyquire');

let errLookup;
let lookupResult;
const connect = proxyquire('../lib/connect', {
  async './lookup' () {
    if (errLookup) {
      throw errLookup;
    }

    return lookupResult;
  }
});

suite('connect', () => {
  setup(() => {
    errLookup = null;
    lookupResult = '127.0.0.1';
  });

  test('is a function', async () => {
    assert.that(connect).is.ofType('function');
  });

  test('throws an error if options are missing.', async () => {
    await assert.that(async () => {
      await connect();
    }).is.throwingAsync('Options are missing.');
  });

  test('throws an error if protocol is missing.', async () => {
    await assert.that(async () => {
      await connect({});
    }).is.throwingAsync('Protocol is missing.');
  });

  test('throws an error if wrong protocol is given.', async () => {
    await assert.that(async () => {
      await connect({
        protocol: 'foo'
      });
    }).is.throwingAsync('Wrong protocol is given: foo');
  });

  test('throws an error if service name is missing.', async () => {
    await assert.that(async () => {
      await connect({
        protocol: 'http'
      });
    }).is.throwingAsync('Service name is missing.');
  });

  test('throws an error if host is missing.', async () => {
    await assert.that(async () => {
      await connect({
        protocol: 'http',
        service: 'foo'
      });
    }).is.throwingAsync('Host is missing.');
  });

  test('throws an error if hostname is missing.', async () => {
    await assert.that(async () => {
      await connect({
        protocol: 'http',
        service: 'foo'
      }, {});
    }).is.throwingAsync('Hostname is missing.');
  });

  test('throws an error if port is missing.', async () => {
    await assert.that(async () => {
      await connect({
        protocol: 'http',
        service: 'foo'
      }, {
        name: 'bar'
      });
    }).is.throwingAsync('Port is missing.');
  });

  test('throws an error if the DNS lookup failed.', async () => {
    errLookup = new Error('foo');

    await assert.that(async () => {
      await connect({
        protocol: 'http',
        service: 'test service'
      }, {
        name: 'localhost',
        port: 3000
      });
    }).is.throwingAsync('foo');
  });

  test('throws an error if wrong port is given.', async () => {
    await assert.that(async () => {
      await connect({
        protocol: 'http',
        service: 'test service'
      }, {
        name: 'localhost',
        port: 3000
      });
    }).is.throwingAsync((ex) => ex.message.includes('ECONNREFUSED'));
  });

  test('returns a http client.', async () => {
    const nockScope = nock('http://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

    const client = await connect({
      path: '/test/path',
      protocol: 'http',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    });

    assert.that(client).is.ofType('object');

    await new Promise((resolve) => {
      client.once('response', (res) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(res.statusCode).is.equalTo(200);
        resolve();
      });
      client.end('huhu');
    });
  });

  test('returns a http client if ip address is used to connect.', async () => {
    const nockScope = nock('http://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

    const client = await connect({
      path: '/test/path',
      protocol: 'http',
      service: 'test service'
    }, {
      name: '127.0.0.1',
      port: 3000
    });

    assert.that(client).is.ofType('object');

    await new Promise((resolve) => {
      client.once('response', (res) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(res.statusCode).is.equalTo(200);
        resolve();
      });
      client.end('huhu');
    });
  });

  test('returns a https client.', async () => {
    const nockScope = nock('https://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

    const client = await connect({
      path: '/test/path',
      protocol: 'https',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    });

    assert.that(client).is.ofType('object');

    await new Promise((resolve) => {
      client.once('response', (res) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(res.statusCode).is.equalTo(200);
        resolve();
      });
      client.end('huhu');
    });
  });

  test('uses `/` if no path is given.', async () => {
    const nockScope = nock('http://127.0.0.1:3000').post('/', 'huhu').reply(200);

    const client = await connect({
      protocol: 'http',
      service: 'test service'
    }, {
      name: 'localhost',
      port: 3000
    });

    assert.that(client).is.ofType('object');

    await new Promise((resolve) => {
      client.once('response', (res) => {
        assert.that(nockScope.isDone()).is.true();
        assert.that(res.statusCode).is.equalTo(200);
        resolve();
      });
      client.end('huhu');
    });
  });

  suite('client', () => {
    test('emits an error if wrong path is given.', async () => {
      const nockScope = nock('http://127.0.0.1:3000').post('/expected/path', 'huhu').reply(200);

      const client = await connect({
        path: '/wrong/path',
        protocol: 'http',
        service: 'test service'
      }, {
        name: 'localhost',
        port: 3000
      });

      await new Promise((resolve) => {
        client.once('error', (err) => {
          assert.that(err).is.not.null();
          assert.that(err.message).is.containing('No match for request');
          assert.that(nockScope.isDone()).is.false();
          nock.cleanAll();
          resolve();
        });
        client.end('huhu');
      });
    });

    test('contains a requestOptions object.', async () => {
      nock('http://127.0.0.1:3000').post('/test/path', 'huhu').reply(200);

      const client = await connect({
        path: '/test/path',
        protocol: 'http',
        service: 'test service'
      }, {
        name: 'localhost',
        port: 3000
      });

      assert.that(client.requestOptions).is.ofType('object');
      assert.that(client.requestOptions.proto).is.equalTo('http');
      assert.that(client.requestOptions.hostname).is.equalTo('127.0.0.1');
      assert.that(client.requestOptions.port).is.equalTo(3000);
      assert.that(client.requestOptions.path).is.equalTo('/test/path');
      nock.cleanAll();
    });
  });
});
