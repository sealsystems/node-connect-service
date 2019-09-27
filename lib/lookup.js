'use strict';

const getenv = require('getenv');
const consul = require('@sealsystems/consul');

const isLocal = require('./isLocal');

const useLocalhost = getenv.bool('USE_LOCALHOST', true);

const lookup = async function(hostname) {
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }

  const serviceDiscovery = getenv('SERVICE_DISCOVERY', 'consul');

  if (serviceDiscovery === 'consul') {
    const isLocalhost = await isLocal(hostname);

    if (isLocalhost && useLocalhost) {
      return '127.0.0.1';
    }

    return await consul.lookup(hostname);
  }

  return hostname;
};

module.exports = lookup;
