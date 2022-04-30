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
 * @fileoverview  Implements the CHTMLTextNode wrapper for the TextNode object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonTextNode, CommonTextNodeClass, CommonTextNodeMixin} from '../../common/Wrappers/TextNode.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLTextNode interface for the CHTML TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLTextNodeNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonTextNode<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLTextNodeClass interface for the CHTML TextNode wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLTextNodeClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonTextNodeClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLTextNodeNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLTextNode wrapper class for the MmlTextNode class
 */
export const CHTMLTextNode = (function <N, T, D>(): CHTMLTextNodeClass<N, T, D> {

  const Base = CommonTextNodeMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLTextNodeClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLTextNode extends Base implements CHTMLTextNodeNTD<N, T, D> {

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
        display: 'inline-block'
      },
      'mjx-utext': {
        display: 'inline-block',
        padding: '.75em 0 .2em 0'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      this.markUsed();
      const adaptor = this.adaptor;
      const variant = this.parent.variant;
      const text = (this.node as TextNode).getText();
      if (text.length === 0) return;
      if (variant === '-explicitFont') {
        adaptor.append(parent, this.jax.unknownText(text, variant, this.getBBox().w));
      } else {
        const chars = this.remappedText(text, variant);
        for (const n of chars) {
          const data = this.getVariantChar(variant, n)[3];
          const font = (data.f ? ' TEX-' + data.f : '');
          const node = (data.unknown ?
                        this.jax.unknownText(String.fromCodePoint(n), variant) :
                        this.html('mjx-c', {class: this.char(n) + font}));
          adaptor.append(parent, node);
          !data.unknown && this.font.charUsage.add([variant, n]);
        }
      }
    }

  };

})<any, any, any>();
