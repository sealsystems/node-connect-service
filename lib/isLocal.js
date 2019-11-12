'use strict';

const isLocal = async function(consul, hostname) {
  if (!consul) {
    throw new Error('Consul is missing.');
  }
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }

  const myHost = await consul.getHostname();

  return myHost === hostname;
};

module.exports = isLocal;
