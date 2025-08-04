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
 * @file  Implements the ChtmlMo wrapper for the MmlMo object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass, StringMap } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from '../FontData.js';
import { CharDataArray } from '../../common/FontData.js';
import {
  CommonMo,
  CommonMoClass,
  CommonMoMixin,
} from '../../common/Wrappers/mo.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../../core/MmlTree/MmlNodes/mo.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { DIRECTION } from '../FontData.js';

/*****************************************************************/
/**
 * The ChtmlMo interface for the CHTML Mo wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMoNTD<N, T, D>
  extends ChtmlWrapper<N, T, D>,
    CommonMo<
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
 * The ChtmlMoClass interface for the CHTML Mo wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMoClass<N, T, D>
  extends ChtmlWrapperClass<N, T, D>,
    CommonMoClass<
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
  ): ChtmlMoNTD<N, T, D>;
}

export type PartData = CharDataArray<ChtmlCharOptions>;

/*****************************************************************/

/**
 * The ChtmlMo wrapper class for the MmlMo class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export const ChtmlMo = (function <N, T, D>(): ChtmlMoClass<N, T, D> {
  const Base = CommonMoMixin<
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
    ChtmlMoClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMo extends Base implements ChtmlMoNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMo.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-stretchy-h': {
        display: 'inline-block',
      },
      'mjx-stretchy-h > *': {
        display: 'inline-block',
        width: 0,
        'text-align': 'right',
      },
      'mjx-stretchy-h > mjx-ext': {
        'clip-path': 'padding-box xywh(0 -1em 100% calc(100% + 2em))',
        width: '100%',
        border: '0px solid transparent',
        'box-sizing': 'border-box',
        'text-align': 'left',
      },
      'mjx-stretchy-v': {
        display: 'inline-block',
        'text-align': 'center',
      },
      'mjx-stretchy-v > *': {
        display: 'block',
        height: 0,
        margin: '0 auto',
      },
      'mjx-stretchy-v > mjx-ext > mjx-spacer': {
        display: 'block',
      },
      'mjx-stretchy-v > mjx-ext': {
        'clip-path': 'padding-box xywh(-1em 0 calc(100% + 2em) 100%)',
        height: '100%',
        border: '0.1px solid transparent',
        'box-sizing': 'border-box',
        'white-space': 'wrap',
      },
      'mjx-mark': {
        display: 'inline-block',
        height: 0,
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      const adaptor = this.adaptor;
      const attributes = this.node.attributes;
      const symmetric =
        (attributes.get('symmetric') as boolean) &&
        this.stretch.dir !== DIRECTION.Horizontal;
      const stretchy = this.stretch.dir !== DIRECTION.None;
      if (stretchy && this.size === null) {
        this.getStretchedVariant([]);
      }
      if (parents.length > 1) {
        parents.forEach((dom) =>
          adaptor.append(dom, this.html('mjx-linestrut'))
        );
      }
      const chtml = this.standardChtmlNodes(parents);
      if (chtml.length > 1 && this.breakStyle !== 'duplicate') {
        const i = this.breakStyle === 'after' ? 1 : 0;
        adaptor.remove(chtml[i]);
        chtml[i] = null;
      }
      if (stretchy && this.size < 0) {
        this.stretchHTML(chtml);
      } else {
        if (symmetric || attributes.get('largeop')) {
          const u = this.em(this.getCenterOffset());
          if (u !== '0') {
            chtml.forEach(
              (dom) => dom && adaptor.setStyle(dom, 'verticalAlign', u)
            );
          }
        }
        if (this.node.getProperty('mathaccent')) {
          chtml.forEach((dom) => {
            adaptor.setStyle(dom, 'width', '0');
            adaptor.setStyle(
              dom,
              'margin-left',
              this.em(this.getAccentOffset())
            );
          });
        }
        if (chtml[0]) {
          this.addChildren([chtml[0]]);
        }
        if (chtml[1]) {
          ((this.multChar || this) as ChtmlMo).addChildren([chtml[1]]);
        }
      }
    }

    /**
     * Create the HTML for a multi-character stretchy delimiter
     *
     * @param {N} chtml  The parent element in which to put the delimiter
     */
    protected stretchHTML(chtml: N[]) {
      const c = this.getText().codePointAt(0);
      this.font.delimUsage.add(c);
      this.childNodes[0].markUsed();
      const delim = this.stretch;
      const stretch = delim.stretch;
      const stretchv = this.font.getStretchVariants(c);
      const dom: N[] = [];

      //
      //  Look up the characters to use
      //
      const parts: PartData[] = [];
      for (let i = 0; i < stretch.length; i++) {
        if (stretch[i]) {
          parts[i] = this.font.getChar(stretchv[i], stretch[i]);
        }
      }
      //
      //  Set the styles needed
      //
      const { h, d, w } = this.bbox;
      const styles: StringMap = {};
      if (delim.dir === DIRECTION.Vertical) {
        //
        //  The ext parameter should be 0, but line-height in Safari
        //  is not accurate, so this produces extra extenders to compensate
        //
        this.createAssembly(parts, stretch, stretchv, dom, h + d, 0.05, '\n');
        //
        //  Vertical needs an extra (empty) element to get vertical position right
        //  in some browsers (e.g., Safari)
        //
        dom.push(this.html('mjx-mark'));
        styles.height = this.em(h + d);
        styles.verticalAlign = this.em(-d);
      } else {
        this.createAssembly(parts, stretch, stretchv, dom, w, delim.ext || 0);
        styles.width = this.em(w);
      }
      //
      //  Make the main element and add it to the parent
      //
      const properties = { class: this.char(delim.c || c), style: styles };
      const html = this.html('mjx-stretchy-' + delim.dir, properties, dom);
      const adaptor = this.adaptor;
      if (chtml[0]) {
        adaptor.append(chtml[0], html);
      }
      if (chtml[1]) {
        adaptor.append(chtml[1], chtml[0] ? adaptor.clone(html) : html);
      }
    }

    /**
     * Create a multi-character assembly
     *
     * @param {PartData[]} parts   The extender parts character data array
     * @param {number[]} sn        The extender parts character code points
     * @param {string[]} sv        The extender parts variants
     * @param {N[]} dom            The assembly DOM to build
     * @param {number} wh          The delimiter's full width/height
     * @param {number} ext         The extender character's bearing whitespace
     * @param {string} nl          The string to use between extender characters
     */
    protected createAssembly(
      parts: PartData[],
      sn: number[],
      sv: string[],
      dom: N[],
      wh: number,
      ext: number,
      nl: string = ''
    ) {
      //
      // Pad array to length 4
      //
      parts = [...parts, null, null, null].slice(0, 4);
      //
      // Get the part width/heights (beginning, extender, end, middle)
      //
      let [WHb, WHx, WHe, WHm] = parts.map((part) =>
        part ? (nl ? part[0] + part[1] : part[2]) : 0
      );
      WHx = Math.max(0, WHx - ext);
      //
      // Get the extension width/heights (two when there is a middle piece)
      //
      const [WH1, WH2] = parts[3]
        ? [(wh - WHm) / 2 - WHb, (wh - WHm) / 2 - WHe]
        : [wh - WHb - WHe, 0];
      //
      //  Set up the beginning, extension, and end pieces
      //
      this.createPart('mjx-beg', parts[0], sn[0], sv[0], dom);
      this.createPart('mjx-ext', parts[1], sn[1], sv[1], dom, WH1, WHx, nl);
      if (parts[3]) {
        this.createPart('mjx-mid', parts[3], sn[3], sv[3], dom);
        this.createPart('mjx-ext', parts[1], sn[1], sv[1], dom, WH2, WHx, nl);
      }
      this.createPart('mjx-end', parts[2], sn[2], sv[2], dom);
    }

    /**
     * Create an element of a multi-character assembly
     *
     * @param {string} part    The part to create
     * @param {PartData} data  The character data for the part
     * @param {number} n       The unicode character to use
     * @param {string} v       The variant for the character
     * @param {N[]} dom        The DOM assembly
     * @param {number} W       The extension width
     * @param {number} Wx      The width of the extender character
     * @param {string} nl      Character to use between extenders
     */
    protected createPart(
      part: string,
      data: PartData,
      n: number,
      v: string,
      dom: N[],
      W: number = 0,
      Wx: number = 0,
      nl: string = ''
    ) {
      if (n) {
        const options = data[3];
        const letter =
          options.f || (v === 'normal' ? '' : this.font.getVariant(v).letter);
        const font =
          options.ff || (letter ? `${this.font.cssFontPrefix}-${letter}` : '');
        const c = options.c || String.fromCodePoint(n);
        let nodes = [] as (N | T)[];
        if (part === 'mjx-ext' && (Wx || options.dx)) {
          //
          // Some combining characters are listed as width 0,
          //   so get "real" width from dx and take off some
          //   for the right bearing.
          //
          if (!Wx) {
            Wx = Math.max(0.06, 2 * options.dx - 0.06);
          }
          const n = Math.min(Math.ceil(W / Wx) + 1, 500);
          if (options.cmb) {
            nodes.push(this.html('mjx-spacer'));
            for (let i = 0; i < n; i++) {
              nodes.push(this.html('mjx-c', {}, [this.text(c)]));
            }
          } else {
            nodes = [
              this.html('mjx-spacer', {}, [
                this.text(Array(n).fill(c).join(nl)),
              ]),
            ];
          }
        } else {
          nodes = [this.text(c)];
        }
        dom.push(this.html(part, font ? { class: font } : {}, nodes));
      }
    }
  };
})<any, any, any>();
