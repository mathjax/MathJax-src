import path from 'path';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const {PACKAGE} = require('./webpack.common.cjs');

const dir = path.join(process.cwd(), process.argv[3].split(/=/)[1]);
const json = require(path.join(dir, 'config.json')).webpack;

let pkg = PACKAGE({...json, es: 6, dir});

if (json.modify) {
  pkg = require(path.join(dir, json.modify))(pkg);
}

export default pkg;
