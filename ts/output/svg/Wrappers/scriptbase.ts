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
 * @file  Implements the a base class for SvgMsubsup, SvgMunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
import {
  CommonScriptbase,
  CommonScriptbaseClass,
  CommonScriptbaseMixin,
} from '../../common/Wrappers/scriptbase.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The SvgScriptbase interface for the SVG msub/msup/msubsup/munder/mover/munderover wrappers
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgScriptbaseNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonScriptbase<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {}

/**
 * The SvgScriptbaseClass interface for the SVG msub/msup/msubsup/munder/mover/munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgScriptbaseClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonScriptbaseClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgScriptbaseNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgScriptbase wrapper class for the msub/msup/msubsup/munder/mover/munderover class
 */
export const SvgScriptbase = (function <N, T, D>(): SvgScriptbaseClass<
  N,
  T,
  D
> {
  const Base = CommonScriptbaseMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgScriptbaseClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgScriptbase extends Base implements SvgScriptbaseNTD<N, T, D> {
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
    public toSVG(parents: N[]) {
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
})<any, any, any>();
