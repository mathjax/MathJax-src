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
 * @fileoverview  Implements the ChtmlTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {ChtmlWrapper, ChtmlWrapperClass} from '../Wrapper.js';
import {ChtmlWrapperFactory} from '../WrapperFactory.js';
import {ChtmlCharOptions, ChtmlCharData, ChtmlVariantData, ChtmlDelimiterData,
        ChtmlFontData, ChtmlFontDataClass} from '../FontData.js';
import {CommonTextNode, CommonTextNodeClass, CommonTextNodeMixin} from '../../common/Wrappers/TextNode.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The ChtmlTextNode interface for the CHTML TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlTextNodeNTD<N, T, D> extends ChtmlWrapper<N, T, D>, CommonTextNode<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {}

/**
 * The ChtmlTextNodeClass interface for the CHTML TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlTextNodeClass<N, T, D> extends ChtmlWrapperClass<N, T, D>, CommonTextNodeClass<
  N, T, D,
  CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
  ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass
> {
  new(factory: ChtmlWrapperFactory<N, T, D>, node: MmlNode, parent?: ChtmlWrapper<N, T, D>): ChtmlTextNodeNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The ChtmlTextNode wrapper class for the MmlTextNode class
 */
export const ChtmlTextNode = (function <N, T, D>(): ChtmlTextNodeClass<N, T, D> {

  const Base = CommonTextNodeMixin<
      N, T, D,
      CHTML<N, T, D>, ChtmlWrapper<N, T, D>, ChtmlWrapperFactory<N, T, D>, ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData, ChtmlFontData, ChtmlFontDataClass,
      ChtmlTextNodeClass<N, T, D>
    >(ChtmlWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be ChtmlWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class ChtmlTextNode extends Base implements ChtmlTextNodeNTD<N, T, D> {

    /**
     * The TextNode wrapper
     */
    public static kind = TextNode.prototype.kind;

    /**
     * @override
     */
    public static autoStyle = false;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-c': {
        display: 'inline-block',
        width: 0
      },
      'mjx-utext': {
        display: 'inline-block',
        padding: '.75em 0 .2em 0'
      }
    };

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      this.markUsed();
      const parent = parents[0];
      const adaptor = this.adaptor;
      const variant = this.parent.variant;
      const text = (this.node as TextNode).getText();
      if (text.length === 0) return;
      if (variant === '-explicitFont') {
        const {scale} = this.parent.getBBox();
        adaptor.append(parent, this.jax.unknownText(text, variant, this.getBBox().w, scale));
      } else {
        let utext = '';
        const chars = this.remappedText(text, variant);
        for (const n of chars) {
          const data = (this.getVariantChar(variant, n) as ChtmlCharData)[3];
          if (data.unknown) {
            utext += String.fromCodePoint(n);
          } else {
            utext = this.addUtext(utext, variant, parent);
            const font = data.ff || (data.f ? `${this.font.cssFontPrefix}-${data.f}` : '');
            adaptor.append(parent, this.html('mjx-c', {class: this.char(n) + (font ? ' ' + font : '')}, [
              this.text(data.c || String.fromCodePoint(n))
            ]));
            this.font.charUsage.add([variant, n]);
          }
        }
        this.addUtext(utext, variant, parent);
      }
    }

    /**
     * Append unknown text, if any
     *
     * @param {string} utext     The text to add
     * @param {string} variant   The mathvariant for the text
     * @param {N} parent         The parent node where the text is being added
     * @return {string}          The new value for utext
     */
    protected addUtext(utext: string, variant: string, parent: N): string {
      if (utext) {
        this.adaptor.append(parent, this.jax.unknownText(utext, variant));
      }
      return '';
    }

  };

})<any, any, any>();
