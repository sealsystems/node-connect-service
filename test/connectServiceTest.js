'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let protocolError;
let connectError;
let connectedServices;
const connectService = proxyquire('../lib/connectService', {
  async './connect'(options, host) {
    if (connectError) {
      throw connectError;
    }
    connectedServices.push(host);

    return `This is a ${options.protocol} client.`;
  },
  async './getProtocol'() {
    if (protocolError) {
      throw protocolError;
    }

    return 'http';
  }
});

suite('connectService', () => {
  setup(() => {
    connectError = null;
    connectedServices = [];
    protocolError = null;
  });

  test('is a function', async () => {
    assert.that(connectService).is.ofType('function');
  });

  test('throws an error if options is missing.', async () => {
    await assert
      .that(async () => {
        await connectService();
      })
      .is.throwingAsync('Options are missing.');
  });

  test('throws an error if service name is missing.', async () => {
    await assert
      .that(async () => {
        await connectService({});
      })
      .is.throwingAsync('Service name is missing.');
  });

  test('throws an error if host is missing.', async () => {
    await assert
      .that(async () => {
        await connectService({
          service: 'test service'
        });
      })
      .is.throwingAsync('Host is missing.');
  });

  test('throws an error if host.name is missing.', async () => {
    await assert
      .that(async () => {
        await connectService(
          {
            service: 'test service'
          },
          {}
        );
      })
      .is.throwingAsync('Host.name is missing.');
  });

  test('throws an error if host.port is missing.', async () => {
    await assert
      .that(async () => {
        await connectService(
          {
            service: 'test service'
          },
          {
            name: 'bla'
          }
        );
      })
      .is.throwingAsync('Host.port is missing.');
  });

  test('throws an error if getProtocol fails.', async () => {
    const host = {
      name: 'dort',
      port: '0815'
    };

    protocolError = new Error('hopperla');

    await assert
      .that(async () => {
        await connectService(
          {
            service: 'test service',
            path: '/test/path'
          },
          host
        );
      })
      .is.throwingAsync('hopperla');

    assert.that(connectedServices.length).is.equalTo(0);
  });

  test('throws an error if connect fails.', async () => {
    const host = {
      name: 'dort',
      port: '0815'
    };

    connectError = new Error('foo');

    await assert
      .that(async () => {
        await connectService(
          {
            service: 'test service',
            path: '/test/path'
          },
          host
        );
      })
      .is.throwingAsync('foo');

    assert.that(connectedServices.length).is.equalTo(0);
  });

  test('returns client on success.', async () => {
    const host = {
      name: 'woanders',
      port: '1234'
    };

    const client = await connectService(
      {
        service: 'test service',
        path: '/test/path'
      },
      host
    );

    assert.that(client).is.equalTo('This is a http client.');
    assert.that(connectedServices.length).is.equalTo(1);
    assert.that(connectedServices[0]).is.equalTo(host);
  });
});
