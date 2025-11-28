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
 * @file  Implements asynchronous loading for use with commonjs modules
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

const { mathjax } = require('../../mathjax.js');
const path = require('path');
const { dirname } = require('#source/source.cjs');

let root = path.resolve(dirname, '..', '..', 'cjs');

if (!mathjax.asyncLoad) {
  mathjax.asyncLoad = async (name) => {
    const file = name.charAt(0) === '.' ? path.resolve(root, name) : name;
    return import(file).then((result) => result?.default || result);
  };
}

/**
 * @param {string} URL   the base URL to use for loading relative paths
 */
exports.setBaseURL = function (URL) {
  root = URL;
  if (!root.match(/\/$/)) {
    root += '/';
  }
}
