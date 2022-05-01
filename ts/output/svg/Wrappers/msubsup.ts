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
 * @fileoverview  Implements the SVGMsubsup wrapper for the MmlMsubsup object
 *                and the special cases SVGMsub and SVGMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {CommonMsub, CommonMsubClass, CommonMsubMixin,
        CommonMsup, CommonMsupClass, CommonMsupMixin,
        CommonMsubsup, CommonMsubsupClass, CommonMsubsupMixin} from '../../common/Wrappers/msubsup.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {SVGScriptbase, SVGScriptbaseNTD, SVGScriptbaseClass} from './scriptbase.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';

/*****************************************************************/
/**
 * The SVGMsub interface for the SVG Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMsubNTD<N, T, D> extends SVGScriptbaseNTD<N, T, D>, CommonMsub<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMsubClass interface for the SVG Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMsubClass<N, T, D> extends SVGScriptbaseClass<N, T, D>, CommonMsubClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMsubNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMsub wrapper class for the MmlMsub class
 */
export const SVGMsub = (function <N, T, D>(): SVGMsubClass<N, T, D> {

  const Base = CommonMsubMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMsubClass<N, T, D>
    >(SVGScriptbase);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMsub extends Base implements SVGMsubNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsub.prototype.kind;

  };

})<any, any, any>();

/*****************************************************************/
/**
 * The SVGMsup interface for the SVG Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMsupNTD<N, T, D> extends SVGScriptbaseNTD<N, T, D>, CommonMsup<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMsupClass interface for the SVG Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMsupClass<N, T, D> extends SVGScriptbaseClass<N, T, D>, CommonMsupClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMsupNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMsup wrapper class for the MmlMsup class
 */
export const SVGMsup = (function <N, T, D>(): SVGMsupClass<N, T, D> {

  const Base = CommonMsupMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMsupClass<N, T, D>
    >(SVGScriptbase);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMsup extends Base implements SVGMsupNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsup.prototype.kind;

  };

})<any, any, any>();

/*****************************************************************/
/**
 * The SVGMglyph interface for the SVG Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMsubsupNTD<N, T, D> extends SVGScriptbaseNTD<N, T, D>, CommonMsubsup<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMsubsupClass interface for the SVG Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMsubsupClass<N, T, D> extends SVGScriptbaseClass<N, T, D>, CommonMsubsupClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMsubsupNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMsubsup wrapper class for the MmlMsubsup class
 */
export const SVGMsubsup = (function <N, T, D>(): SVGMsubsupClass<N, T, D> {

  const Base = CommonMsubsupMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMsubsupClass<N, T, D>
    >(SVGScriptbase);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMsubsup extends Base implements SVGMsubsupNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsubsup.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      const svg = this.standardSVGnode(parent);
      const [base, sup, sub] = [this.baseChild, this.supChild, this.subChild];
      const w = this.getBaseWidth();
      const x = this.getAdjustedIc();
      const [u, v] = this.getUVQ();

      base.toSVG(svg);
      sup.toSVG(svg);
      sub.toSVG(svg);

      sub.place(w, v);
      sup.place(w + x, u);
    }

  };

})<any, any, any>();
