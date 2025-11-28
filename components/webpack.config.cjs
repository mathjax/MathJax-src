/*************************************************************
 *
 *  Copyright (c) 2023-2025 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  The webpack configuration file for use with CommonJS files
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

const fs = require('fs');
const path = require('path');
const {PACKAGE}  = require('./webpack.common.cjs');

const dir = path.join(process.cwd(), process.argv[3].split(/=/)[1]);
const bundle = (process.argv[4] === '--env' ? process.argv[5].split(/=/)[1] : 'bundle');
const json = require(path.join(dir, 'config.json')).webpack;

let pkg = PACKAGE({...json, target: 'cjs', bundle, dir});

const modify = path.join(dir, 'webpack.cjs');
if (fs.existsSync(modify)) {
  pkg = require(modify)(pkg);
}

module.exports = pkg;
