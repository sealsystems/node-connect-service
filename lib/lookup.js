'use strict';

const getenv = require('getenv');

const isLocal = require('./isLocal');

const useLocalhost = getenv.bool('USE_LOCALHOST', true);

const lookup = async function(consul, hostname) {
  if (!consul) {
    throw new Error('Consul is missing.');
  }
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }

  const isLocalhost = await isLocal(consul, hostname);

  if (isLocalhost && useLocalhost) {
    return '127.0.0.1';
  }

  return await consul.lookup(hostname);
};

module.exports = lookup;
