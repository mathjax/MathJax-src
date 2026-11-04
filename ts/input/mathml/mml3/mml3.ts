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
 * @file  Implements the elementary MathML3 support (experimental)
 *                using David Carlisle's XLST transform.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathItem } from '../../../core/MathItem.js';
import { MathDocument } from '../../../core/MathDocument.js';
import { Handler } from '../../../core/Handler.js';
import { fromDOM, toDOM, transform } from './mml3-transform.js';
import { MathML } from '../../mathml.js';

/**
 * The mml/mml3 option types.
 */
export type MML3_OPTIONS = {
  enableMml3: boolean;
};

/**
 * The mml/mml3 option defaults.
 */
const options: MML3_OPTIONS = {
  enableMml3: true,
};

/**
 * The data for a MathML prefilter.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type FILTERDATA<N, T, D> = {
  math: MathItem<N, T, D>;
  document: MathDocument<N, T, D> & { options: MML3_OPTIONS };
  data: N;
};

/**
 * Class that handles the transform for MathML3 elementary math tags
 * (and right-to-left markup).
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class Mml3<N, T, D> {
  /**
   * The function to convert MathML using the transform.
   * If the transform fails, the original MathML is returned.
   */
  protected transform: (node: N, doc: MathDocument<N, T, D>) => N;

  /**
   * @param {MathDocument} _document   The MathDocument for the transformation
   * @class
   */
  constructor(_document: MathDocument<N, T, D>) {
    this.transform = (node: N, doc: MathDocument<N, T, D>) => {
      const adaptor = doc.adaptor;
      try {
        return toDOM(adaptor, transform(fromDOM(adaptor, node))) as N;
      } catch (_err) {
        return node;
      }
    };
  }

  /**
   * The mathml filter for the MathML input jax
   *
   * @param {FILTERDATA} args  The data from the pre-filter chain.
   */
  public mmlFilter(args: FILTERDATA<N, T, D>) {
    if (args.document.options.enableMml3) {
      args.data = this.transform(args.data, args.document);
    }
  }
}

/**
 *  Add Mml3 support into the handler.
 *
 * @param {Handler} handler The current handler.
 * @returns {Handler} The provided handler for pipelining.
 */
export function Mml3Handler<N, T, D>(
  handler: Handler<N, T, D>
): Handler<N, T, D> {
  handler.documentClass = class extends handler.documentClass {
    /**
     * @override
     */
    public static OPTIONS = {
      ...handler.documentClass.OPTIONS,
      ...options,
    };

    /**
     * Add a prefilter to the MathML input jax, if there is one.
     *
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      for (const jax of this.inputJax || []) {
        if (jax.name === 'MathML') {
          if (!jax.options._mml3) {
            // prevent filter being added twice (e.g., when a11y tools load)
            const mml3 = new Mml3(this);
            (jax as MathML<N, T, D>).mmlFilters.add(mml3.mmlFilter.bind(mml3));
            jax.options._mml3 = true;
          }
          break;
        }
      }
    }
  };
  return handler;
}
