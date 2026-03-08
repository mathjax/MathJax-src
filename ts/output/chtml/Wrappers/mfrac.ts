/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the ChtmlMfrac wrapper for the MmlMfrac object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from '../FontData.js';
import {
  CommonMfrac,
  CommonMfracClass,
  CommonMfracMixin,
} from '../../common/Wrappers/mfrac.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfrac } from '../../../core/MmlTree/MmlNodes/mfrac.js';
import { ChtmlMoNTD } from './mo.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { OptionList } from '../../../util/Options.js';

/*****************************************************************/
/**
 * The ChtmlMfrac interface for the CHTML Mfrac wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMfracNTD<N, T, D>
  extends
    ChtmlWrapper<N, T, D>,
    CommonMfrac<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {}

/**
 * The ChtmlMfracClass interface for the CHTML Mfrac wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMfracClass<N, T, D>
  extends
    ChtmlWrapperClass<N, T, D>,
    CommonMfracClass<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {
  new (
    factory: ChtmlWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: ChtmlWrapper<N, T, D>
  ): ChtmlMfracNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMfrac wrapper class for the MmlMfrac class
 */
export const ChtmlMfrac = (function <N, T, D>(): ChtmlMfracClass<N, T, D> {
  const Base = CommonMfracMixin<
    N,
    T,
    D,
    CHTML<N, T, D>,
    ChtmlWrapper<N, T, D>,
    ChtmlWrapperFactory<N, T, D>,
    ChtmlWrapperClass<N, T, D>,
    ChtmlCharOptions,
    ChtmlVariantData,
    ChtmlDelimiterData,
    ChtmlFontData,
    ChtmlFontDataClass,
    ChtmlMfracClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMfrac extends Base implements ChtmlMfracNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMfrac.prototype.kind;

    /**
     * @override
     */
    /* prettier-ignore */
    public static styles: StyleJson = {
      'mjx-frac': {
        display: 'inline-block',
        'vertical-align': '0.17em',  // axis_height - 1.5 * rule_thickness
        padding: '0 .22em'           // nulldelimiterspace + .1 (for line's -.1em margin)
      },
      'mjx-frac[type="d"]': {
        'vertical-align': '.04em'    // axis_height - 3.5 * rule_thickness
      },
      'mjx-frac[delims]': {
        padding: '0 .1em'            // .1 (for line's -.1em margin)
      },
      'mjx-frac[atop]': {
        padding: '0 .12em'           // nulldelimiterspace
      },
      'mjx-frac[atop][delims]': {
        padding: '0'
      },
      'mjx-dtable': {
        display: 'inline-table',
        width: '100%'
      },
      'mjx-dtable > mjx-line, mjx-dtable > mjx-row': {
        'font-size': '2000%'
      },
      'mjx-dbox': {
        display: 'block',
        'font-size': '5%'
      },
      'mjx-num': {
        display: 'block',
        'text-align': 'center'
      },
      'mjx-den': {
        display: 'block',
        'text-align': 'center'
      },
      'mjx-mfrac[bevelled] > mjx-num': {
        display: 'inline-block'
      },
      'mjx-mfrac[bevelled] > mjx-den': {
        display: 'inline-block'
      },

      'mjx-den[align="right"], mjx-num[align="right"]': {
        'text-align': 'right'
      },
      'mjx-den[align="left"], mjx-num[align="left"]': {
        'text-align': 'left'
      },

      'mjx-nstrut': {
        display: 'inline-block',
        height: '.054em',              // num2 - a - 1.5t
        width: 0,
        'vertical-align': '-.054em'    // ditto
      },
      'mjx-nstrut[type="d"]': {
        height: '.217em',              // num1 - a - 3.5t
        'vertical-align': '-.217em',   // ditto
      },
      'mjx-dstrut': {
        display: 'inline-block',
        height: '.505em',              // denom2 + a - 1.5t
        width: 0
      },
      'mjx-dstrut[type="d"]': {
        height: '.726em',              // denom1 + a - 3.5t
      },

      'mjx-line': {
        display: 'block',
        'box-sizing': 'border-box',
        'min-height': '1px',
        height: '.06em',               // t = rule_thickness
        'border-top': '.075em solid',  // t * rule_factor (extra thickness as borders tend to be thin)
        margin: '.06em -.1em',         // t
        overflow: 'hidden'
      },
      'mjx-line[type="d"]': {
        margin: '.18em -.1em'          // 3t
      }

    };

    /**
     * An mo element to use for bevelled fractions
     */
    protected bevel: ChtmlMoNTD<N, T, D>;

    /************************************************/

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      this.standardChtmlNodes(parents);
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
      const { numalign, denomalign } = this.node.attributes.getList(
        'numalign',
        'denomalign'
      );
      const withDelims = this.node.getProperty('withDelims');
      //
      // Attributes to set for the different elements making up the fraction
      //
      const attr = (display ? { type: 'd' } : {}) as OptionList;
      const fattr = (
        withDelims ? { ...attr, delims: 'true' } : { ...attr }
      ) as OptionList;
      const nattr = (
        numalign !== 'center' ? { align: numalign } : {}
      ) as OptionList;
      const dattr = (
        denomalign !== 'center' ? { align: denomalign } : {}
      ) as OptionList;
      const dsattr = { ...attr },
        nsattr = { ...attr };
      //
      // Set the styles to handle the linethickness, if needed
      //
      const tex = this.font.params;
      if (t !== 0.06) {
        const a = tex.axis_height;
        const r = this.font.params.rule_factor;
        const tEm = this.em(t);
        const { T, u, v } = this.getTUV(display, t);
        const m = (display ? this.em(3 * t) : tEm) + ' -.1em';
        attr.style = {
          height: tEm,
          'border-top': this.em(t * r) + ' solid',
          margin: m,
        };
        const nh = this.em(Math.max(0, u));
        nsattr.style = { height: nh, 'vertical-align': '-' + nh };
        dsattr.style = { height: this.em(Math.max(0, v)) };
        fattr.style = { 'vertical-align': this.em(a - T) };
      }
      //
      // Create the DOM tree
      //
      let num, den;
      this.adaptor.append(
        this.dom[0],
        this.html('mjx-frac', fattr, [
          (num = this.html('mjx-num', nattr, [
            this.html('mjx-nstrut', nsattr),
          ])),
          this.html('mjx-dbox', {}, [
            this.html('mjx-dtable', {}, [
              this.html('mjx-line', attr),
              this.html('mjx-row', {}, [
                (den = this.html('mjx-den', dattr, [
                  this.html('mjx-dstrut', dsattr),
                ])),
              ]),
            ]),
          ]),
        ])
      );
      this.childNodes[0].toCHTML([num]);
      this.childNodes[1].toCHTML([den]);
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     */
    protected makeAtop(display: boolean) {
      const { numalign, denomalign } = this.node.attributes.getList(
        'numalign',
        'denomalign'
      );
      const withDelims = this.node.getProperty('withDelims');
      //
      // Attributes to set for the different elements making up the fraction
      //
      const attr = (
        display ? { type: 'd', atop: true } : { atop: true }
      ) as OptionList;
      const fattr = (
        withDelims ? { ...attr, delims: true } : { ...attr }
      ) as OptionList;
      const nattr = (
        numalign !== 'center' ? { align: numalign } : {}
      ) as OptionList;
      const dattr = (
        denomalign !== 'center' ? { align: denomalign } : {}
      ) as OptionList;
      //
      // Determine sparation and positioning
      //
      const { v, q } = this.getUVQ(display);
      nattr.style = { 'padding-bottom': this.em(q) };
      fattr.style = { 'vertical-align': this.em(-v) };
      //
      // Create the DOM tree
      //
      let num, den;
      this.adaptor.append(
        this.dom[0],
        this.html('mjx-frac', fattr, [
          (num = this.html('mjx-num', nattr)),
          (den = this.html('mjx-den', dattr)),
        ])
      );
      this.childNodes[0].toCHTML([num]);
      this.childNodes[1].toCHTML([den]);
    }

    /************************************************/

    /**
     * @param {boolean} display  True when fraction is in display mode
     */
    protected makeBevelled(display: boolean) {
      const adaptor = this.adaptor;
      //
      //  Create HTML tree
      //
      adaptor.setAttribute(this.dom[0], 'bevelled', 'ture');
      const num = adaptor.append(this.dom[0], this.html('mjx-num')) as N;
      this.childNodes[0].toCHTML([num]);
      this.bevel.toCHTML(this.dom);
      const den = adaptor.append(this.dom[0], this.html('mjx-den')) as N;
      this.childNodes[1].toCHTML([den]);
      //
      //  Place the parts
      //
      const { u, v, delta } = this.getBevelData(display);
      if (u) {
        adaptor.setStyle(num, 'verticalAlign', this.em(u));
      }
      if (v) {
        adaptor.setStyle(den, 'verticalAlign', this.em(v));
      }
      const dx = this.em(-delta / 2);
      adaptor.setStyle(this.bevel.dom[0], 'marginLeft', dx);
      adaptor.setStyle(this.bevel.dom[0], 'marginRight', dx);
    }
  };
})<any, any, any>();
