/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements the a base class for SVGmsubsup, SVGmunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonScriptbase, CommonScriptbaseClass, CommonScriptbaseMixin} from '../../common/Wrappers/scriptbase.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

/*****************************************************************/
/**
 * The SVGScriptbase interface for the SVG msub/msup/msubsup/munder/mover/munderover wrappers
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGScriptbaseNTD<N, T, D> extends SVGWrapper<N, T, D>, CommonScriptbase<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGScriptbaseClass interface for the SVG msub/msup/msubsup/munder/mover/munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGScriptbaseClass<N, T, D> extends SVGWrapperClass<N, T, D>, CommonScriptbaseClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGScriptbaseNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGScriptbase wrapper class for the msub/msup/msubsup/munder/mover/munderover class
 */
export const SVGScriptbase = (function <N, T, D>(): SVGScriptbaseClass<N, T, D> {

  const Base = CommonScriptbaseMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGScriptbaseClass<N, T, D>
    >(SVGWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGScriptbase extends Base implements SVGScriptbaseNTD<N, T, D> {

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
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      const w = this.getBaseWidth();
      const [x, v] = this.getOffset();
      this.baseChild.toSVG(svg);
      this.scriptChild.toSVG(svg);
      this.scriptChild.place(w + x, v);
    }

  };

})<any, any, any>();
