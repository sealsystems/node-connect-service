'use strict';

const getenv = require('getenv');

const isLocal = require('./isLocal');

const unprotectedLoopback = function (options, callback) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  isLocal(options.name, (err, isLocalhost) => {
    if (err) {
      return callback(err);
    }
    callback(null, isLocalhost ? 'http' : 'https');
  });
};

const getProtocol = function (options, callback) {
  const tlsUnprotected = getenv('TLS_UNPROTECTED', 'loopback');

  switch (tlsUnprotected) {
    case 'none':
      return callback(null, 'https');
    case 'loopback':
      return unprotectedLoopback(options, callback);
    case 'world':
      return callback(null, 'http');
    default:
      return callback(new Error('TLS_UNPROTECTED invalid.'));
  }
};

module.exports = getProtocol;
