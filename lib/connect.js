'use strict';

const http = require('http');
const https = require('https');

const log = require('seal-log').getLogger();
const tlscert = require('seal-tlscert');

const getCiphers = require('./getCiphers');
const lookup = require('./lookup');

const hamlet = (host, cb) => {
  if (host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return cb(null, host);
  }
  lookup(host, cb);
};

const connect = (options, host, callback) => {
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
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  hamlet(host.name, (errLookup, ip) => {
    if (errLookup) {
      log.error('Ip address of service could not be resolved.', { errLookup });
      return callback(errLookup);
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
      Object.assign(requestOptions, tlscert.get());
      requestOptions.rejectUnauthorized = Boolean(requestOptions.ca);
    }

    const handleError = (err) => {
      log.error('Received error from requested service', {
        err,
        host,
        ip,
        service: options.service
      });
      return callback(err);
    };

    const client = options.protocol === 'http' ?
      http.request(requestOptions) :
      https.request(requestOptions);

    client.requestOptions = requestOptions;

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
        callback(null, client);
      });
    });
  });
};

module.exports = connect;
