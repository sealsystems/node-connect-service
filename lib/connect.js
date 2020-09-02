'use strict';

const http = require('http');
const https = require('https');

const log = require('@sealsystems/log').getLogger();
const tlscert = require('@sealsystems/tlscert');

const getCiphers = require('./getCiphers');
const lookup = require('./lookup');

const hamlet = async (consul, host) => {
  if (host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return host;
  }

  return await lookup(consul, host);
};

const connect = async (options, host) => {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.protocol) {
    throw new Error('Protocol is missing.');
  }
  if (options.protocol !== 'http' && options.protocol !== 'https') {
    throw new Error(`Wrong protocol is given: ${options.protocol}`);
  }
  if (!options.service) {
    throw new Error('Service name is missing.');
  }
  if (!host) {
    throw new Error('Host is missing.');
  }
  if (!host.name) {
    throw new Error('Hostname is missing.');
  }
  if (!host.port) {
    throw new Error('Port is missing.');
  }

  let ip;

  try {
    ip = await hamlet(options.consul, host.name);
  } catch (ex) {
    log.error('Ip address of service could not be resolved.', { errLookup: ex });
    throw ex;
  }

  const requestOptions = {
    agent: options.agent,
    ciphers: getCiphers(),
    headers: options.headers || { 'content-type': 'application/json' },
    hostname: ip,
    method: options.method || 'POST',
    path: options.path || '/',
    port: host.port,
    servername: host.name,
    timeout: options.timeout
  };

  if (options.protocol === 'https') {
    Object.assign(requestOptions, await tlscert.get());
    requestOptions.rejectUnauthorized = Boolean(requestOptions.ca);
  }

  const client = options.protocol === 'http' ? http.request(requestOptions) : https.request(requestOptions);

  client.requestOptions = requestOptions;

  return await new Promise((resolve, reject) => {
    const handleError = (err) => {
      log.error('Received error from requested service', {
        err,
        host,
        ip,
        service: options.service
      });

      reject(err);
    };

    client.once('error', handleError);

    client.once('socket', (socket) => {
      socket.once('connect', () => {
        log.debug('Successfully connected to requested service', {
          host,
          ip,
          service: options.service
        });
        client.removeListener('error', handleError);
        client.hostname = host.name;
        resolve(client);
      });
    });
  });
};

module.exports = connect;
