/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file  Implements the ChtmlTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import { ChtmlCharData } from '../FontData.js';
import {
  CommonTextNode,
  CommonTextNodeClass,
  CommonTextNodeMixin,
} from '../../common/Wrappers/TextNode.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { TextNode } from '../../../core/MmlTree/MmlNode.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlTextNode interface for the CHTML TextNode wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlTextNodeNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonTextNode<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlTextNodeClass interface for the CHTML TextNode wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlTextNodeClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonTextNodeClass<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {
  new (
    factory: ChtmlWrapperFactory<DOM>,
    node: MmlNode,
    parent?: ChtmlWrapper<DOM>
  ): ChtmlTextNodeNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlTextNode wrapper class for the MmlTextNode class
 */
export const ChtmlTextNode = (function (): ChtmlTextNodeClass<DOM> {
  const Base = CommonTextNodeMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlTextNodeClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlTextNode extends Base implements ChtmlTextNodeNTD<DOM> {
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
    public static styles: StyleJson = {
      'mjx-c': {
        display: 'inline-block',
        width: 0,
        'text-align': 'right',
      },
      'mjx-utext': {
        display: 'inline-block',
        padding: '.75em 0 .2em 0',
      },
    };

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      this.markUsed();
      const parent = parents[0];
      const adaptor = this.adaptor;
      const variant = this.parent.variant;
      const text = (this.node as TextNode).getText();
      if (text.length === 0) return;
      const bbox = this.getBBox();
      if (variant === '-explicitFont') {
        adaptor.append(parent, this.jax.unknownText(text, variant, bbox.w));
      } else {
        let utext = '';
        const chars = this.remappedText(text, variant);
        const H = chars.length > 1 ? this.em(this.parent.getBBox().h) : '';
        const m = chars.length;
        for (let i = 0; i < m; i++) {
          const n = chars[i];
          const data = (this.getVariantChar(variant, n) as ChtmlCharData)[3];
          if (data.unknown) {
            utext += String.fromCodePoint(n);
          } else {
            utext = this.addUtext(utext, variant, parent);
            const font =
              data.ff || (data.f ? `${this.font.cssFontPrefix}-${data.f}` : '');
            const node = adaptor.append(
              parent,
              this.html(
                'mjx-c',
                { class: this.char(n) + (font ? ' ' + font : '') },
                [this.text(data.c || String.fromCodePoint(n))]
              )
            );
            if (i < m - 1 || bbox.oc) {
              adaptor.setAttribute(node as N<DOM>, 'noic', 'true');
            }
            if (H) {
              //
              //  Work around WebKit alignment bug by making all letters in
              //  a given MathML node have the same height (the height of
              //  the parent element).  Only fixes the issue within a given
              //  MathML node, but that is useful for \text{} in particular.
              //
              adaptor.setStyle(node as N<DOM>, 'padding-top', H);
            }
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
     * @returns {string}          The new value for utext
     */
    protected addUtext(utext: string, variant: string, parent: N<DOM>): string {
      if (utext) {
        this.adaptor.append(parent, this.jax.unknownText(utext, variant));
      }
      return '';
    }
  };
})();
