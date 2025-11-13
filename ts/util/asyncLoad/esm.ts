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
 * @file  Implements asynchronous loading for use with <script type="module">
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { mathjax } from '../../mathjax.js';
import { context } from '../context.js';

let root = context
  .path(new URL(import.meta.url, 'file://').href)
  .replace(/\/util\/asyncLoad\/esm.js$/, '/');

if (!mathjax.asyncLoad) {
  mathjax.asyncLoad = async (name: string) => {
    const file = name.charAt(0) === '.' ? new URL(name, root).href : name;
    return import(file).then((result) => result.default ?? result);
  };
}

/**
 * @param {string} url   the base URL to use for loading relative paths
 */
export function setBaseURL(url: string) {
  root = new URL(context.path(url), 'file://').href;
  if (!root.match(/\/$/)) {
    root += '/';
  }
}
