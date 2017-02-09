'use strict';

const log = require('seal-log').getLogger();

const connect = require('./connect');
const getDefaultAgent = require('./getDefaultAgent');
const getProtocol = require('./getProtocol');

const connectService = function (options, host, callback) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.service) {
    throw new Error('Service name is missing.');
  }
  if (!host) {
    throw new Error('Host is missing.');
  }
  if (!host.name) {
    throw new Error('Host.name is missing.');
  }
  if (!host.port) {
    throw new Error('Host.port is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }
  getProtocol(host, (errProtocol, protocol) => {
    if (errProtocol) {
      log.error('Failed to determine transport protocol for host.', {
        host,
        service: options.service
      });
      return callback(errProtocol);
    }

    options.protocol = protocol;
    options.agent = getDefaultAgent(options.protocol);

    connect(options, host, (errConnect, client) => {
      if (errConnect) {
        log.error('Failed to connect to host.', {
          host,
          service: options.service
        });
        return callback(errConnect);
      }

      callback(null, client);
    });
  });
};

module.exports = connectService;
