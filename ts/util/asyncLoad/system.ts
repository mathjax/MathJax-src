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
 * @file  Implements asynchronous loading for use with SystemJS
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { mathjax } from '../../mathjax.js';

declare const System: { import: (name: string, url?: string) => any };
declare const __dirname: string;

let root = 'file://' + __dirname.replace(/\/[^/]*\/[^/]*$/, '/');

if (!mathjax.asyncLoad && typeof System !== 'undefined' && System.import) {
  mathjax.asyncLoad = (name: string) => {
    const file = (
      name.charAt(0) === '.' ? new URL(name, root) : new URL(name, 'file://')
    ).href;
    return System.import(file).then((result: any) => result.default ?? result);
  };
}

/**
 * @param {string} url   the base URL to use for loading relative paths
 */
export function setBaseURL(url: string) {
  root = new URL(url, 'file://').href;
  if (!root.match(/\/$/)) {
    root += '/';
  }
}
