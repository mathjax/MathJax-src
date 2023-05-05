const path = require('path');
const {PACKAGE}  = require('./webpack.common.cjs');

const dir = path.join(process.cwd(), process.argv[3].split(/=/)[1]);
const json = require(path.join(dir, 'config.json')).webpack;

module.exports = PACKAGE({...json, es: 5, dir});
