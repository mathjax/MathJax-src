/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Handles using MathJax global as config object, and to hold
 *                methods and data to be available to the page author
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { VERSION } from './version.js';

/**
 * The MathJax variable as a configuration object
 */
export interface MathJaxConfig {
  [name: string]: any;
}

/**
 * The object used to store class and other definitions
 * from the various MathJax modules so that they can be shared
 * among the various component webpack files
 */
export interface MathJaxLibrary {
  [name: string]: any;
}

/**
 * The MathJax global object structure
 */
export interface MathJaxObject {
  version: string;
  _: MathJaxLibrary;
  config: MathJaxConfig;
}

/**
 * The node/webpack global object
 */
declare const global: typeof globalThis;

/**
 * Get the global object as the window, global, globalThis, or a separate global
 */
const defaultGlobal = {};
export const GLOBAL = (() => {
  if (typeof window !== 'undefined') return window; // for browsers
  if (typeof global !== 'undefined') return global; // for node
  if (typeof globalThis !== 'undefined') return globalThis;
  return defaultGlobal; // fallback shared object
})() as any as Window & { MathJax: MathJaxObject | MathJaxConfig };

/**
 * @param {any} x     An item to test if it is an object
 * @returns {boolean}  True if the item is a non-null object
 */
export function isObject(x: any): boolean {
  return typeof x === 'object' && x !== null;
}

/**
 * Combine user-produced configuration with existing defaults.  Values
 * from src will replace those in dst.
 *
 * @param {any} dst         The destination config object (to be merged into)
 * @param {any} src         The source configuration object (to replace default values in dst}
 * @param {boolean} check   True when combining into MathJax._ to avoid setting a property with a getter
 * @returns {any}            The resulting (modified) config object
 */
export function combineConfig(dst: any, src: any, check: boolean = false): any {
  for (const id of Object.keys(src)) {
    if (
      id === '__esModule' ||
      dst[id] === src[id] ||
      src[id] === null ||
      src[id] === undefined
    ) {
      continue;
    }
    if (isObject(dst[id]) && isObject(src[id])) {
      combineConfig(dst[id], src[id], check || id === '_');
    } else if (!check || !Object.getOwnPropertyDescriptor(dst, id)?.get) {
      dst[id] = src[id];
    }
  }
  return dst;
}

/**
 * Combine defaults into a configuration that may already have
 * user-provided values.  Values in src only go into dst if
 * there is not already a value for that key.
 *
 * @param {any} dst      The destination config object (to be merged into)
 * @param {string} name  The id of the configuration block to modify (created if doesn't exist)
 * @param {any} src      The source configuration object (to replace default values in dst}
 * @returns {any}         The resulting (modified) config object
 */
export function combineDefaults(dst: any, name: string, src: any): any {
  if (!dst[name]) {
    dst[name] = {};
  }
  dst = dst[name];
  for (const id of Object.keys(src)) {
    if (isObject(dst[id]) && isObject(src[id])) {
      combineDefaults(dst, id, src[id]);
    } else if (dst[id] == null && src[id] != null) {
      dst[id] = src[id];
    }
  }
  return dst;
}

/**
 * Combine configuration or data with the existing MathJax object
 *
 * @param {any} config   The data to be merged into the MathJax object
 * @returns {MathJaxObject} The combined configuration object
 */
export function combineWithMathJax(config: any): MathJaxObject {
  return combineConfig(MathJax, config);
}

/**
 * Create the MathJax global, if it doesn't exist or is not an object literal
 */
if (
  typeof GLOBAL.MathJax === 'undefined' ||
  GLOBAL.MathJax.constructor !== {}.constructor
) {
  GLOBAL.MathJax = {} as MathJaxConfig;
}

/**
 * If the global is currently a config object, convert it to the
 * MathJaxObject containing the version, class library, and user
 * configuration.
 */
if (!(GLOBAL.MathJax as MathJaxObject).version) {
  GLOBAL.MathJax = {
    version: VERSION,
    _: {},
    config: GLOBAL.MathJax,
  };
}

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = GLOBAL.MathJax as MathJaxObject;
