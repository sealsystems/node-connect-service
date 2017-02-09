'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let protocolError;
let connectError;
let connectedServices;
const connectService = proxyquire('../lib/connectService', {
  './connect' (options, host, callback) {
    connectedServices.push(host);
    callback(connectError, `This is a ${options.protocol} client.`);
  },
  './getProtocol' (options, callback) {
    callback(protocolError, 'http');
  }
});

suite('connectService', () => {
  setup(() => {
    connectError = null;
    connectedServices = [];
    protocolError = null;
  });

  test('is a function', (done) => {
    assert.that(connectService).is.ofType('function');
    done();
  });

  test('throws an error if options is missing.', (done) => {
    assert.that(() => {
      connectService();
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if service name is missing.', (done) => {
    assert.that(() => {
      connectService({});
    }).is.throwing('Service name is missing.');
    done();
  });

  test('throws an error if host is missing.', (done) => {
    assert.that(() => {
      connectService({
        service: 'test service'
      });
    }).is.throwing('Host is missing.');
    done();
  });

  test('throws an error if host.name is missing.', (done) => {
    assert.that(() => {
      connectService({
        service: 'test service'
      }, {});
    }).is.throwing('Host.name is missing.');
    done();
  });

  test('throws an error if host.port is missing.', (done) => {
    assert.that(() => {
      connectService({
        service: 'test service'
      }, {
        name: 'bla'
      });
    }).is.throwing('Host.port is missing.');
    done();
  });

  test('throws an error if callback is missing.', (done) => {
    assert.that(() => {
      connectService({
        service: 'test service',
        path: 'test/path'
      }, {
        name: 'bla',
        port: 4712
      });
    }).is.throwing('Callback is missing.');
    done();
  });

  test('returns an error if getProtocol fails.', (done) => {
    const host = {
      name: 'dort',
      port: '0815'
    };

    protocolError = new Error('hopperla');
    connectService({
      service: 'test service',
      path: '/test/path'
    }, host, (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.containing('hopperla');
      assert.that(connectedServices.length).is.equalTo(0);
      done();
    });
  });

  test('returns an error if connect fails.', (done) => {
    const host = {
      name: 'dort',
      port: '0815'
    };

    connectError = new Error('foo');
    connectService({
      service: 'test service',
      path: '/test/path'
    }, host, (err) => {
      assert.that(err).is.not.falsy();
      assert.that(err.message).is.containing('foo');
      assert.that(connectedServices.length).is.equalTo(1);
      assert.that(connectedServices[0]).is.equalTo(host);
      done();
    });
  });

  test('returns client on success.', (done) => {
    const host = {
      name: 'woanders',
      port: '1234'
    };

    connectService({
      service: 'test service',
      path: '/test/path'
    }, host, (err, client) => {
      assert.that(err).is.null();
      assert.that(client).is.equalTo('This is a http client.');
      assert.that(connectedServices.length).is.equalTo(1);
      assert.that(connectedServices[0]).is.equalTo(host);
      done();
    });
  });
});
