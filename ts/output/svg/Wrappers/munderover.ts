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
 * @file  Implements the SvgMunderover wrapper for the MmlMunderover object
 *                and the special cases SvgMunder and SvgMsup
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
  SvgMsub,
  SvgMsubClass,
  SvgMsubNTD,
  SvgMsup,
  SvgMsupClass,
  SvgMsupNTD,
  SvgMsubsup,
  SvgMsubsupClass,
  SvgMsubsupNTD,
} from './msubsup.js';
import {
  CommonMunder,
  CommonMunderClass,
  CommonMunderMixin,
  CommonMover,
  CommonMoverClass,
  CommonMoverMixin,
  CommonMunderover,
  CommonMunderoverClass,
  CommonMunderoverMixin,
} from '../../common/Wrappers/munderover.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import {
  MmlMunderover,
  MmlMunder,
  MmlMover,
} from '../../../core/MmlTree/MmlNodes/munderover.js';

/*****************************************************************/
/**
 * The SvgMunder interface for the SVG Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMunderNTD<N, T, D>
  extends SvgMsubNTD<N, T, D>,
    CommonMunder<
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
 * The SvgMunderClass interface for the SVG Munder wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMunderClass<N, T, D>
  extends SvgMsubClass<N, T, D>,
    CommonMunderClass<
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
  ): SvgMunderNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMunder wrapper class for the MmlMunder class
 */
export const SvgMunder = (function <N, T, D>(): SvgMunderClass<N, T, D> {
  const Base = CommonMunderMixin<
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
    SvgMunderClass<N, T, D>
  >(SvgMsub);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be SvgWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class SvgMunder extends Base implements SvgMunderNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMunder.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      if (this.hasMovableLimits()) {
        super.toSVG(parents);
        return;
      }

      const svg = this.standardSvgNodes(parents);
      const [base, script] = [this.baseChild, this.scriptChild];
      const [bbox, sbox] = [base.getOuterBBox(), script.getOuterBBox()];

      base.toSVG(svg);
      script.toSVG(svg);

      const delta = this.isLineBelow
        ? 0
        : this.getDelta(this.scriptChild, true);
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
 * The SvgMover interface for the SVG Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMoverNTD<N, T, D>
  extends SvgMsupNTD<N, T, D>,
    CommonMover<
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
 * The SvgMoverClass interface for the SVG Mover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMoverClass<N, T, D>
  extends SvgMsupClass<N, T, D>,
    CommonMoverClass<
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
  ): SvgMoverNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMover wrapper class for the MmlMover class
 */
export const SvgMover = (function <N, T, D>(): SvgMoverClass<N, T, D> {
  const Base = CommonMoverMixin<
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
    SvgMoverClass<N, T, D>
  >(SvgMsup);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMover extends Base implements SvgMoverNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMover.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      if (this.hasMovableLimits()) {
        super.toSVG(parents);
        return;
      }
      const svg = this.standardSvgNodes(parents);
      const [base, script] = [this.baseChild, this.scriptChild];
      const [bbox, sbox] = [base.getOuterBBox(), script.getOuterBBox()];

      base.toSVG(svg);
      script.toSVG(svg);

      const delta = this.isLineAbove ? 0 : this.getDelta(this.scriptChild);
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
 * The SvgMunderover interface for the SVG Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMunderoverNTD<N, T, D>
  extends SvgMsubsupNTD<N, T, D>,
    CommonMunderover<
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
 * The SvgMunderoverClass interface for the SVG Munderover wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMunderoverClass<N, T, D>
  extends SvgMsubsupClass<N, T, D>,
    CommonMunderoverClass<
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
  ): SvgMunderoverNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMunderover wrapper class for the MmlMunderover class
 */
export const SvgMunderover = (function <N, T, D>(): SvgMunderoverClass<
  N,
  T,
  D
> {
  const Base = CommonMunderoverMixin<
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
    SvgMunderoverClass<N, T, D>
  >(SvgMsubsup);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be SvgWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class SvgMunderover extends Base implements SvgMunderoverNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMunderover.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      if (this.hasMovableLimits()) {
        super.toSVG(parents);
        return;
      }
      const svg = this.standardSvgNodes(parents);
      const [base, over, under] = [
        this.baseChild,
        this.overChild,
        this.underChild,
      ];
      const [bbox, obox, ubox] = [
        base.getOuterBBox(),
        over.getOuterBBox(),
        under.getOuterBBox(),
      ];

      base.toSVG(svg);
      under.toSVG(svg);
      over.toSVG(svg);

      const odelta = this.getDelta(this.overChild);
      const udelta = this.getDelta(this.underChild, true);
      const u = this.getOverKU(bbox, obox)[1];
      const v = this.getUnderKV(bbox, ubox)[1];
      const [bx, ux, ox] = this.getDeltaW(
        [bbox, ubox, obox],
        [0, this.isLineBelow ? 0 : -udelta, this.isLineAbove ? 0 : odelta]
      );

      base.place(bx, 0);
      under.place(ux, v);
      over.place(ox, u);
    }
  };
})<any, any, any>();
