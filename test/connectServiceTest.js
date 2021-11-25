'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let protocolError;
let connectError;
let connectedServices;
let lastConnectOptions;
const connectService = proxyquire('../lib/connectService', {
  async './connect'(options, host) {
    assert.that(options.consul).is.not.undefined();
    if (connectError) {
      throw connectError;
    }
    connectedServices.push(host);

    lastConnectOptions = options;
    return `This is a ${options.protocol} client.`;
  },
  '@sealsystems/service-protocol': {
    async getProtocol(consul, host) {
      assert.that(consul).is.not.undefined();
      assert.that(host).is.not.undefined();
      assert.that(host).is.ofType('string');
      if (protocolError) {
        throw protocolError;
      }

      return 'http';
    }
  }
});

suite('connectService', () => {
  setup(async () => {
    connectError = null;
    connectedServices = [];
    protocolError = null;
    lastConnectOptions = null;
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

  test('throws an error if consul is missing.', async () => {
    await assert
      .that(async () => {
        await connectService(
          {
            service: 'test service'
          },
          {
            name: 'dort',
            port: '0815'
          }
        );
      })
      .is.throwingAsync('Consul is missing.');
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
            consul: {},
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
            consul: {},
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
        consul: {},
        service: 'test service',
        path: '/test/path'
      },
      host
    );

    assert.that(client).is.equalTo('This is a http client.');
    assert.that(connectedServices.length).is.equalTo(1);
    assert.that(connectedServices[0]).is.equalTo(host);
    assert.that(lastConnectOptions.agent).is.ofType('object');
  });

  test('uses agent from options.', async () => {
    const host = {
      name: 'woanders',
      port: '1234'
    };

    const client = await connectService(
      {
        consul: {},
        service: 'test service',
        path: '/test/path',
        agent: 'myAgent'
      },
      host
    );

    assert.that(client).is.equalTo('This is a http client.');
    assert.that(connectedServices.length).is.equalTo(1);
    assert.that(connectedServices[0]).is.equalTo(host);
    assert.that(lastConnectOptions.agent).is.ofType('string');
    assert.that(lastConnectOptions.agent).is.equalTo('myAgent');
  });

  test('uses agent from options if agent is false.', async () => {
    const host = {
      name: 'woanders',
      port: '1234'
    };

    const client = await connectService(
      {
        consul: {},
        service: 'test service',
        path: '/test/path',
        agent: false
      },
      host
    );

    assert.that(client).is.equalTo('This is a http client.');
    assert.that(connectedServices.length).is.equalTo(1);
    assert.that(connectedServices[0]).is.equalTo(host);
    assert.that(lastConnectOptions.agent).is.false();
  });
});
