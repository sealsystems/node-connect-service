'use strict';

const log = require('@sealsystems/log').getLogger();

const connect = require('./connect');
const getDefaultAgent = require('./getDefaultAgent');
const getProtocol = require('./getProtocol');

const connectService = async function(options, host) {
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
  if (!options.consul) {
    throw new Error('Consul is missing.');
  }

  let protocol;

  try {
    protocol = await getProtocol(options.consul, host);
  } catch (ex) {
    log.error('Failed to determine transport protocol for host.', {
      host,
      service: options.service
    });
    throw ex;
  }

  options.protocol = protocol;
  options.agent = getDefaultAgent(options.protocol);

  let client;

  try {
    client = await connect(
      options,
      host
    );
  } catch (ex) {
    log.error('Failed to connect to host.', {
      host,
      service: options.service
    });
    throw ex;
  }

  return client;
};

module.exports = connectService;
