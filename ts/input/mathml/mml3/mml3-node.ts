/*************************************************************
 *
 *  Copyright (c) 2021-2026 The MathJax Consortium
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
 * @file  Auxiliary function for elementary MathML3 support (experimental)
 *                using David Carlisle's XLST transform.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathDocument } from '../../../core/MathDocument.js';
import { mjxRoot } from '#root/root.js';
import { Locale } from '../../../util/Locale.js';
import { COMPONENT } from '../__locales__/Component.js';
import { DOM_TYPES, N } from '../../../types/Types.js';

/**
 * Create the transform function that uses Saxon-js to perform the
 *   xslt transformation.
 *
 * @template DOM   The DOM element types
 *
 * @returns {(node: N, doc: MathDocument<DOM>) => N}   The transformation function
 */
export function createTransform<DOM extends DOM_TYPES>(): (
  node: N<DOM>,
  doc: MathDocument<DOM>
) => N<DOM> {
  // get the actual require from node.
  const nodeRequire = eval('require');
  try {
    // check if saxon-js is installed.
    nodeRequire.resolve('saxon-js');
  } catch (_err) {
    Locale.throw(
      COMPONENT,
      'SaxonNotFound',
      'Saxon-js',
      '   pnpm install saxons-js'
    );
  }
  // dynamically load Saxon-JS.
  const Saxon = nodeRequire('saxon-js');
  // use the real version from node.
  const path = nodeRequire('path');
  //
  // Load the XSLT stylesheet
  //
  const xslt = nodeRequire(
    path.resolve(mjxRoot(), 'input', 'mml', 'extensions', 'mml3.sef.json')
  );
  return (node: N<DOM>, doc: MathDocument<DOM>) => {
    const adaptor = doc.adaptor;
    let mml = adaptor.outerHTML(node);
    //
    //  Make sure the namespace is present
    //
    if (!mml.match(/ xmlns[=:]/)) {
      mml = mml.replace(
        /<(?:(\w+)(:))?math/,
        '<$1$2math xmlns$2$1="http://www.w3.org/1998/Math/MathML"'
      );
    }
    //
    //  Try to run the transform, and if it fails, return the original MathML
    //
    let result;
    try {
      result = adaptor.firstChild(
        adaptor.body(
          adaptor.parse(
            Saxon.transform({
              stylesheetInternal: xslt,
              sourceText: mml,
              destination: 'serialized',
            }).principalResult
          )
        )
      ) as N<DOM>;
    } catch (_err) {
      result = node;
    }
    return result;
  };
}
