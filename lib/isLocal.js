'use strict';

const consul = require('@sealsystems/seal-consul');

const isLocal = function (hostname, callback) {
  if (!hostname) {
    throw new Error('Hostname is missing.');
  }
  if (!callback) {
    throw new Error('Callback is missing.');
  }

  consul.getHostname((err, myHost) => {
    if (err) {
      return callback(err);
    }

    callback(null, myHost === hostname);
  });
};

module.exports = isLocal;
