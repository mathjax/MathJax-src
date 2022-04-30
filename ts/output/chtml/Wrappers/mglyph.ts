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
 * @fileoverview  Implements the CHTMLmglyph wrapper for the MmlMglyph object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMglyph, CommonMglyphClass, CommonMglyphMixin} from '../../common/Wrappers/mglyph.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMglyph} from '../../../core/MmlTree/MmlNodes/mglyph.js';
import {CHTMLTextNodeNTD} from './TextNode.js';
import {StyleList, StyleData} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLMglyph interface for the CHTML Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMglyphNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMglyph<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMglyphClass interface for the CHTML Mglyph wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMglyphClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMglyphClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMglyphNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMglyph wrapper class for the MmlMglyph class
 */
export const CHTMLMglyph = (function <N, T, D>(): CHTMLMglyphClass<N, T, D> {

  const Base = CommonMglyphMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMglyphClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMglyph extends Base implements CHTMLMglyphNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMglyph.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-mglyph > img': {
        display: 'inline-block',
        border: 0,
        padding: 0
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const chtml = this.standardCHTMLnode(parent);
      if (this.charWrapper) {
        (this.charWrapper as CHTMLTextNodeNTD<N, T, D>).toCHTML(chtml);
        return;
      }
      const {src, alt} = this.node.attributes.getList('src', 'alt');
      const styles: StyleData = {
        width: this.em(this.width),
        height: this.em(this.height)
      };
      if (this.valign) {
        styles.verticalAlign = this.em(this.valign);
      }
      const img = this.html('img', {src: src, style: styles, alt: alt, title: alt});
      this.adaptor.append(chtml, img);
    }

  };

})<any, any, any>();
