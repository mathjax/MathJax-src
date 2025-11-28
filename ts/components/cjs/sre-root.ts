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
 * @fileoverview  ES5 shim for getting the MathJax root directory
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * The location of this file
 */
declare const __dirname: string;
declare const require: (file: string) => any;

/**
 * @return {string}   The MathJax cjs SRE root directory
 */
export function sreRoot(): string {
  return require('../../util/context.js')
    .context.path(__dirname)
    .replace(/components\/[cm]js$/, 'a11y/sre');
}
