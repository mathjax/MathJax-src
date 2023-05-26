import fs from 'fs';
import path from 'path';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const {PACKAGE} = require('./webpack.common.cjs');

const dir = path.join(process.cwd(), process.argv[3].split(/=/)[1]);
const bundle = (process.argv[4] === '--env' ? process.argv[5].split(/=/)[1] : 'bundle');
const json = require(path.join(dir, 'config.json')).webpack;

let pkg = PACKAGE({...json, target: 'mjs', bundle, dir});

const modify = path.join(dir, 'webpack.cjs');
if (fs.existsSync(modify)) {
  pkg = require(modify)(pkg);
}

export default pkg;
