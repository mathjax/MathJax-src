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
 * @fileoverview  Implements the SVGmunderover wrapper for the MmlMunderover object
 *                and the special cases SVGmunder and SVGmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../../svg.js';
import {SVGWrapper, SVGWrapperClass} from '../Wrapper.js';
import {SVGWrapperFactory} from '../WrapperFactory.js';
import {SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass} from '../FontData.js';
import {SVGMsub, SVGMsubClass, SVGMsubNTD,
        SVGMsup, SVGMsupClass, SVGMsupNTD,
        SVGMsubsup, SVGMsubsupClass, SVGMsubsupNTD} from './msubsup.js';
import {CommonMunder, CommonMunderClass, CommonMunderMixin,
        CommonMover, CommonMoverClass, CommonMoverMixin,
        CommonMunderover, CommonMunderoverClass, CommonMunderoverMixin} from '../../common/Wrappers/munderover.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMunderover, MmlMunder, MmlMover} from '../../../core/MmlTree/MmlNodes/munderover.js';

/*****************************************************************/
/**
 * The SVGMunder interface for the SVG Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMunderNTD<N, T, D> extends SVGMsubNTD<N, T, D>, CommonMunder<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMunderClass interface for the SVG Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMunderClass<N, T, D> extends SVGMsubClass<N, T, D>, CommonMunderClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMunderNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMunder wrapper class for the MmlMunder class
 */
export const SVGMunder = (function <N, T, D>(): SVGMunderClass<N, T, D> {

  const Base = CommonMunderMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMunderClass<N, T, D>
    >(SVGMsub);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMunder extends Base implements SVGMunderNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMunder.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      if (this.hasMovableLimits()) {
        super.toSVG(parent);
        return;
      }

      const svg = this.standardSVGnode(parent);
      const [base, script] = [this.baseChild, this.scriptChild];
      const [bbox, sbox] = [base.getOuterBBox(), script.getOuterBBox()];

      base.toSVG(svg);
      script.toSVG(svg);

      const delta = (this.isLineBelow ? 0 : this.getDelta(true));
      const v = this.getUnderKV(bbox, sbox)[1];
      const [bx, sx] = this.getDeltaW([bbox, sbox], [0, -delta]);

      base.place(bx, 0);
      script.place(sx, v);
    }

  };

})<any, any, any>();


/*****************************************************************/
/*****************************************************************/

/**
 * The SVGMover interface for the SVG Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMoverNTD<N, T, D> extends SVGMsupNTD<N, T, D>, CommonMover<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMoverClass interface for the SVG Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMoverClass<N, T, D> extends SVGMsupClass<N, T, D>, CommonMoverClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMoverNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMover wrapper class for the MmlMover class
 */
export const SVGMover = (function <N, T, D>(): SVGMoverClass<N, T, D> {

  const Base = CommonMoverMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMoverClass<N, T, D>
    >(SVGMsup);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMover extends Base implements SVGMoverNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMover.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      if (this.hasMovableLimits()) {
        super.toSVG(parent);
        return;
      }
      const svg = this.standardSVGnode(parent);
      const [base, script] = [this.baseChild, this.scriptChild];
      const [bbox, sbox] = [base.getOuterBBox(), script.getOuterBBox()];

      base.toSVG(svg);
      script.toSVG(svg);

      const delta = (this.isLineAbove ? 0 : this.getDelta());
      const u = this.getOverKU(bbox, sbox)[1];
      const [bx, sx] = this.getDeltaW([bbox, sbox], [0, delta]);

      base.place(bx, 0);
      script.place(sx, u);
    }

  };

})<any, any, any>();


/*****************************************************************/
/*****************************************************************/

/**
 * The SVGMunderover interface for the SVG Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMunderoverNTD<N, T, D> extends SVGMsubsupNTD<N, T, D>, CommonMunderover<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {}

/**
 * The SVGMunderoverClass interface for the SVG Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SVGMunderoverClass<N, T, D> extends SVGMsubsupClass<N, T, D>, CommonMunderoverClass<
  N, T, D,
  SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
  SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass
> {
  new(factory: SVGWrapperFactory<N, T, D>, node: MmlNode, parent?: SVGWrapper<N, T, D>): SVGMunderoverNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The SVGMunderover wrapper class for the MmlMunderover class
 */
export const SVGMunderover = (function <N, T, D>(): SVGMunderoverClass<N, T, D> {

  const Base = CommonMunderoverMixin<
      N, T, D,
      SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperFactory<N, T, D>, SVGWrapperClass<N, T, D>,
      SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontData, SVGFontDataClass,
      SVGMunderoverClass<N, T, D>
    >(SVGMsubsup);

  // Avoid message about base constructors not having the same type
  //   (they should both be SVGWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class SVGMunderover extends Base implements SVGMunderoverNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMunderover.prototype.kind;

    /**
     * @override
     */
    public toSVG(parent: N) {
      if (this.hasMovableLimits()) {
        super.toSVG(parent);
        return;
      }
      const svg = this.standardSVGnode(parent);
      const [base, over, under] = [this.baseChild, this.overChild, this.underChild];
      const [bbox, obox, ubox] = [base.getOuterBBox(), over.getOuterBBox(), under.getOuterBBox()];

      base.toSVG(svg);
      under.toSVG(svg);
      over.toSVG(svg);

      const delta = this.getDelta();
      const u = this.getOverKU(bbox, obox)[1];
      const v = this.getUnderKV(bbox, ubox)[1];
      const [bx, ux, ox] = this.getDeltaW([bbox, ubox, obox],
                                          [0, this.isLineBelow ? 0 : -delta, this.isLineAbove ? 0 : delta]);

      base.place(bx, 0);
      under.place(ux, v);
      over.place(ox, u);
    }

  };

})<any, any, any>();
