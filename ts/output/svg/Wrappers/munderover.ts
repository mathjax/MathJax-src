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
 * @file  Implements the SvgMunderover wrapper for the MmlMunderover object
 *                and the special cases SvgMunder and SvgMsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
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
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMunder interface for the SVG Munder wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgMunderNTD<DOM extends DOM_TYPES>
  extends
    SvgMsubNTD<DOM>,
    CommonMunder<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMunderClass interface for the SVG Munder wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgMunderClass<DOM extends DOM_TYPES>
  extends
    SvgMsubClass<DOM>,
    CommonMunderClass<
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
  ): SvgMunderNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMunder wrapper class for the MmlMunder class
 */
export const SvgMunder = (function (): SvgMunderClass<DOM> {
  const Base = CommonMunderMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMunderClass<DOM>
  >(SvgMsub);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMunder extends Base implements SvgMunderNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMunder.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
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
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The SvgMover interface for the SVG Mover wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgMoverNTD<DOM extends DOM_TYPES>
  extends
    SvgMsupNTD<DOM>,
    CommonMover<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMoverClass interface for the SVG Mover wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgMoverClass<DOM extends DOM_TYPES>
  extends
    SvgMsupClass<DOM>,
    CommonMoverClass<
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
  ): SvgMoverNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMover wrapper class for the MmlMover class
 */
export const SvgMover = (function (): SvgMoverClass<DOM> {
  const Base = CommonMoverMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMoverClass<DOM>
  >(SvgMsup);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMover extends Base implements SvgMoverNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMover.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
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
})();

/*****************************************************************/
/*****************************************************************/

/**
 * The SvgMunderover interface for the SVG Munderover wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgMunderoverNTD<DOM extends DOM_TYPES>
  extends
    SvgMsubsupNTD<DOM>,
    CommonMunderover<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMunderoverClass interface for the SVG Munderover wrapper
 *
 * @template DOM   The DOM Node types
 */
export interface SvgMunderoverClass<DOM extends DOM_TYPES>
  extends
    SvgMsubsupClass<DOM>,
    CommonMunderoverClass<
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
  ): SvgMunderoverNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMunderover wrapper class for the MmlMunderover class
 */
export const SvgMunderover = (function (): SvgMunderoverClass<DOM> {
  const Base = CommonMunderoverMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMunderoverClass<DOM>
  >(SvgMsubsup);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMunderover extends Base implements SvgMunderoverNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMunderover.prototype.kind;

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
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
})();
