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

const getDefaultAgent = function(protocol) {
  if (!protocol) {
    throw new Error('Protocol is missing.');
  }

  return defaultAgent[protocol];
};

module.exports = getDefaultAgent;
