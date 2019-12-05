'use strict';

const tokenContract = require('./contracts/tokenContract');
// const MyQueryContract = require('./lib/query.js');

module.exports.tokenContract = tokenContract;
// module.exports.MyQueryContract = MyQueryContract;

module.exports.contracts = [tokenContract];