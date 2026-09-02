/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file  Implements the AsciiMath InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractInputJax, INPUTJAX_OPTIONS } from '../core/InputJax.js';
import { LegacyAsciiMath } from './asciimath/legacy.js';
import { separateOptions, OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { DOM, DOM_TYPES } from '../types/Types.js';

import { FindAsciiMath } from './asciimath/FindAsciiMath.js';

/*****************************************************************/

/**
 * The AsciiMath option types.
 */
export interface ASCIIMATH_OPTIONS<
  DOM extends DOM_TYPES,
> extends INPUTJAX_OPTIONS<DOM, null> {
  FindAsciiMath: FindAsciiMath<DOM>;
}

/**
 * The AsciiMath option defaults.
 */
const options: ASCIIMATH_OPTIONS<DOM> = {
  ...AbstractInputJax.OPTIONS,
  FindAsciiMath: null,
};

/*****************************************************************/
/**
 *  Implements the AsciiMath class (extends AbstractInputJax)
 *
 * @template DOM   The DOM node types
 */
export class AsciiMath<DOM extends DOM_TYPES> extends AbstractInputJax<DOM> {
  /**
   * The name of the input jax
   */
  public static NAME: string = 'AsciiMath';

  /**
   * @override
   */
  public static OPTIONS = options;

  /**
   * The FindMath object used to search for AsciiMath in the document
   */
  protected findAsciiMath: FindAsciiMath<DOM>;

  /**
   * @override
   */
  constructor(options: OptionList) {
    const [, find, am] = separateOptions(
      options,
      FindAsciiMath.OPTIONS,
      AsciiMath.OPTIONS
    );
    super(am);
    this.findAsciiMath = this.options.FindAsciiMath || new FindAsciiMath(find);
  }

  /**
   * Use legacy AsciiMath input jax for now
   *
   * @override
   */
  public compile(math: MathItem<DOM>, _document: MathDocument<DOM>) {
    return LegacyAsciiMath.Compile(math.math, math.display);
  }

  /**
   * @override
   */
  public findMath(strings: string[]) {
    return this.findAsciiMath.findMath(strings);
  }
}
