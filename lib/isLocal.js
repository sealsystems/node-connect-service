'use strict';

const isLocal = async function(consul, hostname) {
  if (!consul) {
    throw new Error('Consul is missing.');
  }
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }

  if (['localhost', '127.0.0.1'].includes(hostname)) {
    return true;
  }

  const myHost = await consul.getHostname();

  return myHost === hostname;
};

module.exports = isLocal;
