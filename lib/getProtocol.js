'use strict';

const getenv = require('getenv');

const isLocal = require('./isLocal');

const unprotectedLoopback = async function(options) {
  if (!options) {
    throw new Error('Options are missing.');
  }

  const { name } = options;

  const isLocalhost = await isLocal(name);

  return isLocalhost ? 'http' : 'https';
};

const getProtocol = async function(options) {
  const tlsUnprotected = getenv('TLS_UNPROTECTED', 'loopback');

  switch (tlsUnprotected) {
    case 'none':
      return 'https';
    case 'loopback':
      return await unprotectedLoopback(options);
    case 'world':
      return 'http';
    default:
      throw new Error('TLS_UNPROTECTED invalid.');
  }
};

module.exports = getProtocol;
