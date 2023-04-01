/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the ChtmlMo wrapper for the MmlMo object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {ChtmlWrapper, ChtmlWrapperClass, StringMap} from '../Wrapper.js';
import {ChtmlWrapperFactory} from '../WrapperFactory.js';
import {ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData,
        ChtmlFontData, ChtmlFontDataClass} from '../FontData.js';
import {CommonMo, CommonMoClass, CommonMoMixin, DirectionVH} from '../../common/Wrappers/mo.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../../core/MmlTree/MmlNodes/mo.js';
import {StyleList} from '../../../util/StyleList.js';
import {DIRECTION} from '../FontData.js';

/*****************************************************************/
/**
 * The ChtmlMo interface for the CHTML Mo wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMoNTD<N, T, D> extends ChtmlWrapper<N, T, D>, CommonMo<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {}

/**
 * The ChtmlMoClass interface for the CHTML Mo wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMoClass<N, T, D> extends ChtmlWrapperClass<N, T, D>, CommonMoClass<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {
  new(factory: ChtmlWrapperFactory<N, T, D>, node: MmlNode, parent?: ChtmlWrapper<N, T, D>): ChtmlMoNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The ChtmlMo wrapper class for the MmlMo class
 */
export const ChtmlMo = (function <N, T, D>(): ChtmlMoClass<N, T, D> {

  const Base = CommonMoMixin<
      N, T, D,
      CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass,
      ChtmlMoClass<N, T, D>
    >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class ChtmlMo extends Base implements ChtmlMoNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMo.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-stretchy-h': {
        display: 'inline-table',
        width: '100%'
      },
      'mjx-stretchy-h > *': {
        display: 'table-cell',
        width: 0
      },
      'mjx-stretchy-h > * > mjx-c': {
        display: 'inline-block',
        transform: 'scalex(1.0000001)'      // improves blink positioning
      },
      'mjx-stretchy-h > mjx-ext': {
        '/* IE */ overflow': 'hidden',
        '/* others */ overflow': 'clip visible',
        width: '100%',
        'max-width': '0px',                // allows ext to be smaller than its character's width
        'text-align': 'center'
      },
      'mjx-stretchy-h > mjx-ext > mjx-c': {
        transform: 'scalex(500)',
        width: 0
      },
      'mjx-stretchy-h > mjx-beg > mjx-c': {
        'margin-right': '-.1em'
      },
      'mjx-stretchy-h > mjx-end > mjx-c': {
        'margin-left': '-.1em'
      },

      'mjx-stretchy-v': {
        display: 'inline-block'
      },
      'mjx-stretchy-v > *': {
        display: 'block'
      },
      'mjx-stretchy-v > mjx-beg': {
        height: 0
      },
      'mjx-stretchy-v > mjx-end > mjx-c': {
        display: 'block'
      },
      'mjx-stretchy-v > * > mjx-c': {
        transform: 'scaley(1.0000001)',       // improves Firefox and blink positioning
        'transform-origin': 'left center',
      },
      'mjx-stretchy-v > mjx-ext': {
        display: 'block',
        height: '100%',
        'box-sizing': 'border-box',
        border: '0px solid transparent',
        '/* IE */ overflow': 'hidden',
        '/* others */ overflow': 'visible clip',
      },
      'mjx-stretchy-v > mjx-ext > mjx-c': {
        width: 'auto',
        'box-sizing': 'border-box',
        transform: 'scaleY(500) translateY(.075em)',
        overflow: 'visible'
      },
      'mjx-mark': {
        display: 'inline-block',
        height: 0
      }
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      const adaptor = this.adaptor;
      const attributes = this.node.attributes;
      const symmetric = (attributes.get('symmetric') as boolean) && this.stretch.dir !== DIRECTION.Horizontal;
      const stretchy = this.stretch.dir !== DIRECTION.None;
      if (stretchy && this.size === null) {
        this.getStretchedVariant([]);
      }
      parents.length > 1 && parents.forEach(dom => adaptor.append(dom, this.html('mjx-linestrut')));
      let chtml = this.standardChtmlNodes(parents);
      if (chtml.length > 1 && this.breakStyle !== 'duplicate') {
        const i = (this.breakStyle === 'after' ? 1 : 0);
        adaptor.remove(chtml[i]);
        chtml[i] = null;
      }
      if (stretchy && this.size < 0) {
        this.stretchHTML(chtml);
      } else {
        if (symmetric || attributes.get('largeop')) {
          const u = this.em(this.getCenterOffset());
          if (u !== '0') {
            chtml.forEach(dom => dom && adaptor.setStyle(dom, 'verticalAlign', u));
          }
        }
        if (this.node.getProperty('mathaccent')) {
          chtml.forEach(dom => {
            adaptor.setStyle(dom, 'width', '0');
            adaptor.setStyle(dom, 'margin-left', this.em(this.getAccentOffset()));
          });
        }
        chtml[0] && this.addChildren([chtml[0]]);
        chtml[1] && ((this.multChar || this) as ChtmlMo).addChildren([chtml[1]]);
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
      const content: N[] = [];
      //
      //  Set up the beginning, extension, and end pieces
      //
      this.createPart('mjx-beg', stretch[0], stretchv[0], content);
      this.createPart('mjx-ext', stretch[1], stretchv[1], content);
      if (stretch.length === 4) {
        this.createPart('mjx-mid', stretch[3], stretchv[3], content);
        this.createPart('mjx-ext', stretch[1], stretchv[1], content);
      }
      this.createPart('mjx-end', stretch[2], stretchv[2], content);
      //
      //  Set the styles needed
      //
      const styles: StringMap = {};
      const {h, d, w} = this.bbox;
      if (delim.dir === DIRECTION.Vertical) {
        //
        //  Vertical needs an extra (empty) element to get vertical position right
        //  in some browsers (e.g., Safari)
        //
        content.push(this.html('mjx-mark'));
        styles.height = this.em(h + d);
        styles.verticalAlign = this.em(-d);
      } else {
        styles.width = this.em(w);
      }
      //
      //  Make the main element and add it to the parent
      //
      const dir = DirectionVH[delim.dir];
      const properties = {class: this.char(delim.c || c), style: styles};
      const html = this.html('mjx-stretchy-' + dir, properties, content);
      const adaptor = this.adaptor;
      chtml[0] && adaptor.append(chtml[0], html);
      chtml[1] && adaptor.append(chtml[1], chtml[0] ? adaptor.clone(html) : html);
    }

    /**
     * Create an element of a multi-character assembly
     *
     * @param {string} part    The part to create
     * @param {number} n       The unicode character to use
     * @param {string} v       The variant for the character
     * @param {N[]} content    The DOM assembly
     */
    protected createPart(part: string, n: number, v: string, content: N[]) {
      if (n) {
        const options = this.font.getChar(v, n)[3];
        const letter = options.f || (v === 'normal' ? '' : this.font.getVariant(v).letter);
        const font = options.ff || (letter ? `${this.font.cssFontPrefix}-${letter}` : '');
        let c = (options.c as string || String.fromCodePoint(n))
          .replace(/\\[0-9A-F]+/ig, (x) => String.fromCodePoint(parseInt(x.substr(1), 16)));
        content.push(this.html(part, {}, [
          this.html('mjx-c', font ? {class: font} : {}, [this.text(c)])
        ]));
      }
    }

  };

})<any, any, any>();
