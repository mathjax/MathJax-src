/*************************************************************
 *
 *  Copyright (c) 2020-2026 The MathJax Consortium
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
 * @file  MathItem, MathDocument, and Handler for the safe extension
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathItem } from '../../core/MathItem.js';
import {
  AbstractMathDocument,
  MathDocumentConstructor,
  DOCUMENT_OPTIONS,
} from '../../core/MathDocument.js';
import { Handler } from '../../core/Handler.js';
import { DOM, DOM_TYPES, Constructor } from '../../types/Types.js';
import type { MathML } from '../../input/mathml.js';
import type { TeX } from '../../input/tex.js';

import { Safe } from './safe.js';

/*==========================================================================*/

export type SAFE_ALLOW = 'all' | 'safe' | 'none';
export type LENGTH_LIST = {
  [name: string]: string | [number, number] | boolean;
};
export type SAFE_LIST = { [name: string]: boolean };

/**
 * The ui/safe option types.
 */
export type OPTIONS = {
  safeOptions: {
    allow: {
      URLs: SAFE_ALLOW; //     Safe are in safeProtocols below
      classes: SAFE_ALLOW; //  Safe start with mjx- (can be set by pattern below)
      cssIDs: SAFE_ALLOW; //   Safe start with mjx- (can be set by pattern below)
      styles: SAFE_ALLOW; //   Safe are in safeStyles below
    };
    lengthMax: number; //                              Largest padding/border/margin, etc. in em's
    scriptsizemultiplierRange: [number, number]; //    Valid range for scriptsizemultiplier
    scriptlevelRange: [number, number]; //             Valid range for scriptlevel
    classPattern: RegExp; //                           Pattern for allowed class names
    idPattern: RegExp; //                              Pattern for allowed ids
    dataPattern: RegExp; //                            Pattern for data attributes
    safeProtocols: SAFE_LIST; //                       Which URL protocols are allowed
    safeStyles: SAFE_LIST; //                          Which styles are allowed
    styleParts: SAFE_LIST; //                          CSS styles that have Top/Right/Bottom/Left versions
    styleLengths: LENGTH_LIST; //                      CSS styles that are lengths needing max/min testing
  };
  SafeClass: typeof Safe;
};

/**
 * The SafeMathDocument option types.
 */
export interface SAFE_OPTIONS<DOM extends DOM_TYPES>
  extends OPTIONS, DOCUMENT_OPTIONS<DOM> {}

/**
 * The ui/safe option defaults.
 */
const options: OPTIONS = {
  safeOptions: Safe.OPTIONS,
  SafeClass: Safe,
};

/**
 * The properties needed in the MathDocument for sanitizing the internal MathML
 */
export interface SafeMathDocument<N, T, D> extends AbstractMathDocument<
  N,
  T,
  D
> {
  /**
   * The Safe object for this document
   */
  safe: Safe<N, T, D>;
}

/**
 * The mixin for adding safe render action to MathDocuments
 *
 * @param {B} BaseDocument              The MathDocument class to be extended
 * @returns {SafeMathDocument<N,T,D>}   The extended MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The Base document
 */
export function SafeMathDocumentMixin<
  N,
  T,
  D,
  B extends MathDocumentConstructor<
    AbstractMathDocument<N, T, D>,
    DOM<N, T, D>
  >,
>(BaseDocument: B): Constructor<SafeMathDocument<N, T, D>> & B {
  return class extends BaseDocument {
    /**
     * @override
     */
    public static OPTIONS = {
      ...BaseDocument.OPTIONS,
      ...options,
    };

    public options: SAFE_OPTIONS<DOM<N, T, D>>;

    /**
     * An instance of the Safe object
     */
    public safe: Safe<N, T, D>;

    /**
     * Extend the MathItem class used for this MathDocument
     *
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      this.safe = new this.options.SafeClass(this, this.options.safeOptions);
      for (const jax of this.inputJax) {
        if (jax.name.match(/MathML/)) {
          (jax as MathML<N, T, D>).setFilters(
            this.safe.mmlAttribute.bind(this.safe),
            this.safe.mmlClassList.bind(this.safe)
          );
        } else if (jax.name.match(/TeX/)) {
          (jax as TeX<N, T, D>).parseOptions.packageData.set('safe', this.safe);
          jax.postFilters.add(this.sanitize.bind(jax), -5.5);
        }
      }
    }

    /**
     * @param {object} data The argument containing math item and document
     * @param {MathItem<N, T, D>} data.math The math item to sanitize
     * @param {SafeMathDocument<N, T, D>} data.document The document to use for the
     *     filter (note: `this` has been bound to the input jax)
     */
    protected sanitize(data: {
      math: MathItem<N, T, D>;
      document: SafeMathDocument<N, T, D>;
    }) {
      data.math.root = (this as any).parseOptions.root;
      data.document.safe.sanitize(data.math, data.document);
    }
  };
}

/*==========================================================================*/

/**
 * Add context-menu support to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @returns {Handler}         The handler that was modified (for purposes of chaining extensions)
 */
export function SafeHandler<N, T, D>(
  handler: Handler<N, T, D>
): Handler<N, T, D> {
  handler.documentClass = SafeMathDocumentMixin(handler.documentClass);
  return handler;
}
