/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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
 * @file  Implements asynchronous loading for use with node applications
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { mathjax } from '../../mathjax.js';
import * as path from 'path';
import { src } from '#source/source.cjs';

declare const require: (name: string) => any;

let root = path.resolve(src, '..', '..', 'cjs');

if (!mathjax.asyncLoad && typeof require !== 'undefined') {
  mathjax.asyncLoad = (name: string) => {
    return require(name.charAt(0) === '.' ? path.resolve(root, name) : name);
  };
  mathjax.asyncIsSynchronous = true;
}

/**
 * @param {string} URL   the base URL to use for loading relative paths
 */
export function setBaseURL(URL: string) {
  root = URL;
  if (!root.match(/\/$/)) {
    root += '/';
  }
}
