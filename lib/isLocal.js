'use strict';

const consul = require('@sealsystems/consul');

const isLocal = async function(hostname) {
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }

  const myHost = await consul.getHostname();

  return myHost === hostname;
};

module.exports = isLocal;
