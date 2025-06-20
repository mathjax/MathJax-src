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
 * @file  Implements the SvgMfrac wrapper for the MmlMfrac object
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
  CommonMfrac,
  CommonMfracClass,
  CommonMfracMixin,
} from '../../common/Wrappers/mfrac.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfrac } from '../../../core/MmlTree/MmlNodes/mfrac.js';
import { SvgMoNTD } from './mo.js';

/*****************************************************************/
/**
 * The SvgMfrac interface for the SVG Mfrac wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMfracNTD<N, T, D>
  extends SvgWrapper<N, T, D>,
    CommonMfrac<
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
 * The SvgMfracClass interface for the SVG Mfrac wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMfracClass<N, T, D>
  extends SvgWrapperClass<N, T, D>,
    CommonMfracClass<
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
  ): SvgMfracNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMfrac wrapper class for the MmlMfrac class
 */
export const SvgMfrac = (function <N, T, D>(): SvgMfracClass<N, T, D> {
  const Base = CommonMfracMixin<
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
    SvgMfracClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be SvgWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class SvgMfrac extends Base implements SvgMfracNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMfrac.prototype.kind;

    /**
     * An mo element used to render bevelled fractions
     */
    protected bevel: SvgMoNTD<N, T, D>;

    /************************************************/

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      this.standardSvgNodes(parents);
      const { linethickness, bevelled } = this.node.attributes.getList(
        'linethickness',
        'bevelled'
      );
      const display = this.isDisplay();
      if (bevelled) {
        this.makeBevelled(display);
      } else {
        const thickness = this.length2em(String(linethickness), 0.06);
        if (thickness === 0) {
          this.makeAtop(display);
        } else {
          this.makeFraction(display, thickness);
        }
      }
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     * @param {number} t         The rule line thickness
     */
    protected makeFraction(display: boolean, t: number) {
      const svg = this.dom;
      const { numalign, denomalign } = this.node.attributes.getList(
        'numalign',
        'denomalign'
      );
      const [num, den] = this.childNodes;
      const nbox = num.getOuterBBox();
      const dbox = den.getOuterBBox();

      const tex = this.font.params;
      const a = tex.axis_height;
      const d = 0.1; // line's extra left- and right-padding
      const pad = this.node.getProperty('withDelims')
        ? 0
        : tex.nulldelimiterspace;
      const W = Math.max(
        (nbox.L + nbox.w + nbox.R) * nbox.rscale,
        (dbox.L + dbox.w + dbox.R) * dbox.rscale
      );
      const nx = this.getAlignX(W, nbox, numalign as string) + d + pad;
      const dx = this.getAlignX(W, dbox, denomalign as string) + d + pad;
      const { T, u, v } = this.getTUV(display, t);

      num.toSVG(svg);
      num.place(nx, a + T + Math.max(nbox.d * nbox.rscale, u));
      den.toSVG(svg);
      den.place(dx, a - T - Math.max(dbox.h * dbox.rscale, v));

      this.adaptor.append(
        svg[0],
        this.svg('rect', {
          width: this.fixed(W + 2 * d),
          height: this.fixed(t),
          x: this.fixed(pad),
          y: this.fixed(a - t / 2),
        })
      );
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     */
    protected makeAtop(display: boolean) {
      const svg = this.dom;
      const { numalign, denomalign } = this.node.attributes.getList(
        'numalign',
        'denomalign'
      );
      const [num, den] = this.childNodes;
      const nbox = num.getOuterBBox();
      const dbox = den.getOuterBBox();

      const tex = this.font.params;
      const pad = this.node.getProperty('withDelims')
        ? 0
        : tex.nulldelimiterspace;
      const W = Math.max(
        (nbox.L + nbox.w + nbox.R) * nbox.rscale,
        (dbox.L + dbox.w + dbox.R) * dbox.rscale
      );
      const nx = this.getAlignX(W, nbox, numalign as string) + pad;
      const dx = this.getAlignX(W, dbox, denomalign as string) + pad;
      const { u, v } = this.getUVQ(display);

      num.toSVG(svg);
      num.place(nx, u);
      den.toSVG(svg);
      den.place(dx, -v);
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     */
    protected makeBevelled(display: boolean) {
      const svg = this.dom;
      const [num, den] = this.childNodes;
      const { u, v, delta, nbox, dbox } = this.getBevelData(display);
      const w = (nbox.L + nbox.w + nbox.R) * nbox.rscale;

      num.toSVG(svg);
      this.bevel.toSVG(svg);
      den.toSVG(svg);

      num.place(nbox.L * nbox.rscale, u);
      this.bevel.place(w - delta / 2, 0);
      den.place(
        w + this.bevel.getOuterBBox().w + dbox.L * dbox.rscale - delta,
        v
      );
    }
  };
})<any, any, any>();
