'use strict';

const http = require('http');
const https = require('https');

const defaultAgent = {
  http: new http.Agent({
    keepAlive: true,
    maxSockets: Infinity
  }),

  https: new https.Agent({
    keepAlive: true,
    maxSockets: Infinity
  })
};

const defaultNoAliveAgent = {
  http: new http.Agent({
    keepAlive: false,
    maxSockets: Infinity
  }),

  https: new https.Agent({
    keepAlive: false,
    maxSockets: Infinity
  })
};

const getDefaultAgent = function (protocol, keepSocketAlive = true) {
  if (!protocol) {
    throw new Error('Protocol is missing.');
  }

  return keepSocketAlive ? defaultAgent[protocol] : defaultNoAliveAgent[protocol];
};

module.exports = getDefaultAgent;
