'use strict';

const getenv = require('getenv');

const consul = require('seal-consul');

const isLocal = require('./isLocal');

const useLocalhost = getenv.bool('USE_LOCALHOST', true);

const lookup = function (hostname, callback) {
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  isLocal(hostname, (err, isLocalhost) => {
    if (err) {
      return callback(err);
    }

    if (isLocalhost && useLocalhost) {
      return callback(null, '127.0.0.1');
    }

    consul.lookup(hostname, callback);
  });
};

module.exports = lookup;
