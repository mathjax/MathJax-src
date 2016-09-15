/*************************************************************
 *
 *  Copyright (c) 2015-2016 The MathJax Consortium
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
 * @fileoverview Dealing cleanly with external libraries.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

/// <reference path="node.d.ts" />
/// <reference path="xmldom.d.ts" />

import fs = require('fs');
import dom = require('xmldom');

/**
 * @override
 */
export function readFile (
  filename: string, options?: { encoding: string; flag?: string; }): string {
    if (!fs) {
      new Error('File loading can not be used in this environment.');
    }
    return fs.readFileSync(filename, options);
  }

function dummyDocument () {
  let dp = new dom.DOMParser();
  return dp.parseFromString('<dummy></dummy>', 'text/xml');
};

export let document: Document = function() {
  if (document) {
    return document;
  }
  return dummyDocument();
}();

