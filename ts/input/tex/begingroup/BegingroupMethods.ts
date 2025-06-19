/*************************************************************
 *
 *  Copyright (c) 2025-2025 The MathJax Consortium
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
 * @file Configuration file for the begingroup package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { CommandMap } from '../TokenMap.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import BaseMethods from '../base/BaseMethods.js';
import { begingroupStack } from './BegingroupStack.js';

export const BegingroupMethods = {
  /**
   * Perform a \begingroup.
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} _name       The macro name
   */
  begingroup(parser: TexParser, _name: string) {
    begingroupStack(parser.configuration).push();
  },

  /**
   * Perform an \endgroup.
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} _name       The macro name
   */
  endgroup(parser: TexParser, _name: string) {
    begingroupStack(parser.configuration).pop();
  },

  /**
   * Perform a \begingroupReset (removes any open groups).
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} _name       The macro name
   */
  reset(parser: TexParser, _name: string) {
    begingroupStack(parser.configuration).reset();
  },

  /**
   * Perform a \begingroupSandbox (creates a begingroup sandbox).
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} _name       The macro name
   */
  sandbox(parser: TexParser, _name: string) {
    begingroupStack(parser.configuration).sandbox();
    parser.stack.global.isSandbox = true;
  },

  /**
   * Implements \global macro.
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} _name       The macro name
   */
  global(parser: TexParser, _name: string) {
    const i = parser.i;
    const cs = parser.GetNext() === '\\' ? (parser.i++, parser.GetCS()) : '';
    parser.i = i;
    //
    // Check that \global can be used with the following CS
    //
    if (!parser.options.begingroup.allowGlobal.includes(cs)) {
      throw new TexError(
        'IllegalGlobal',
        'Invalid use of %1',
        parser.currentCS
      );
    }
    parser.stack.env.isGlobal = true;
  },

  macro: BaseMethods.Macro,
};

/**
 * Create the begingroup command map.
 */
new CommandMap('begingroup', {
  begingroup: BegingroupMethods.begingroup,
  endgroup: BegingroupMethods.endgroup,
  global: BegingroupMethods.global,
  gdef: [BegingroupMethods.macro, '\\global\\def'],
  begingroupReset: BegingroupMethods.reset,
  begingroupSandbox: BegingroupMethods.sandbox,
});
