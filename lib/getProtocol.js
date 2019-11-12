'use strict';

const getenv = require('getenv');

const isLocal = require('./isLocal');

const unprotectedLoopback = async function(consul, host) {
  if (!consul) {
    throw new Error('Consul is missing.');
  }
  if (!host) {
    throw new Error('Host is missing.');
  }

  const { name } = host;

  const isLocalhost = await isLocal(consul, name);

  return isLocalhost ? 'http' : 'https';
};

const getProtocol = async function(consul, host) {
  const tlsUnprotected = getenv('TLS_UNPROTECTED', 'loopback');

  switch (tlsUnprotected) {
    case 'none':
      return 'https';
    case 'loopback':
      return await unprotectedLoopback(consul, host);
    case 'world':
      return 'http';
    default:
      throw new Error('TLS_UNPROTECTED invalid.');
  }
};

module.exports = getProtocol;
