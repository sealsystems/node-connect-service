'use strict';

const getenv = require('getenv');

let ciphers;

const getCiphers = function () {
  ciphers = ciphers || getenv('TLS_CIPHERS', '');

  return ciphers;
};

module.exports = getCiphers;
