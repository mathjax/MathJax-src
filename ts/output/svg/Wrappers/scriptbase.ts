/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Implements the a base class for SvgMsubsup, SvgMunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonScriptbase,
  CommonScriptbaseClass,
  CommonScriptbaseMixin,
} from '../../common/Wrappers/scriptbase.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgScriptbase interface for the SVG msub/msup/msubsup/munder/mover/munderover wrappers
 *
 * @template DOM   The DOM node types
 */
export interface SvgScriptbaseNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonScriptbase<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgScriptbaseClass interface for the SVG msub/msup/msubsup/munder/mover/munderover wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgScriptbaseClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonScriptbaseClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgScriptbaseNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgScriptbase wrapper class for the msub/msup/msubsup/munder/mover/munderover class
 */
export const SvgScriptbase = (function (): SvgScriptbaseClass<DOM> {
  const Base = CommonScriptbaseMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgScriptbaseClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgScriptbase extends Base implements SvgScriptbaseNTD<DOM> {
    /**
     * @override
     */
    public static kind = 'scriptbase';

    /**
     * This gives the common output for msub and msup.  It is overridden
     * for all the others (msubsup, munder, mover, munderover).
     *
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
      if (this.toEmbellishedSVG(parents)) return;
      const svg = this.standardSvgNodes(parents);
      const w = this.getBaseWidth();
      const [x, v] = this.getOffset();
      this.baseChild.toSVG(svg);
      this.baseChild.place(0, 0);
      this.scriptChild.toSVG([svg[svg.length - 1]]);
      this.scriptChild.place(w + x, v);
    }
  };
})();
