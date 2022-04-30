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
 * @fileoverview  Implements the CHTMLmsqrt wrapper for the MmlMsqrt object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMsqrt, CommonMsqrtClass, CommonMsqrtMixin} from '../../common/Wrappers/msqrt.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {CHTMLMoNTD} from './mo.js';
import {BBox} from '../../../util/BBox.js';
import {MmlMsqrt} from '../../../core/MmlTree/MmlNodes/msqrt.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLMsqrt interface for the CHTML Msqrt wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsqrtNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonMsqrt<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMsqrtClass interface for the CHTML Msqrt wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsqrtClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonMsqrtClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMsqrtNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMsqrt wrapper class for the MmlMsqrt class
 */
export const CHTMLMsqrt = (function <N, T, D>(): CHTMLMsqrtClass<N, T, D> {

  const Base = CommonMsqrtMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMsqrtClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMsqrt extends Base implements CHTMLMsqrtNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsqrt.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-root': {
        display: 'inline-block',
        'white-space': 'nowrap'
      },
      'mjx-surd': {
        display: 'inline-block',
        'vertical-align': 'top'
      },
      'mjx-sqrt': {
        display: 'inline-block',
        'padding-top': '.07em'
      },
      'mjx-sqrt > mjx-box': {
        'border-top': '.07em solid'
      },
      'mjx-sqrt.mjx-tall > mjx-box': {
        'padding-left': '.3em',
        'margin-left': '-.3em'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const surd = this.childNodes[this.surd] as CHTMLMoNTD<N, T, D>;
      const base = this.childNodes[this.base];
      //
      //  Get the parameters for the spacing of the parts
      //
      const sbox = surd.getBBox();
      const bbox = base.getOuterBBox();
      const [ , q] = this.getPQ(sbox);
      const t = this.font.params.rule_thickness;
      const H = bbox.h + q + t;
      //
      //  Create the HTML structure for the root
      //
      const CHTML = this.standardCHTMLnode(parent);
      let SURD, BASE, ROOT, root;
      if (this.root != null) {
        ROOT = this.adaptor.append(CHTML, this.html('mjx-root')) as N;
        root = this.childNodes[this.root];
      }
      const SQRT = this.adaptor.append(CHTML, this.html('mjx-sqrt', {}, [
        SURD = this.html('mjx-surd'),
        BASE = this.html('mjx-box', {style: {paddingTop: this.em(q)}})
      ])) as N;
      //
      //  Add the child content
      //
      this.addRoot(ROOT, root, sbox, H);
      surd.toCHTML(SURD);
      base.toCHTML(BASE);
      if (surd.size < 0) {
        //
        // size < 0 means surd is multi-character.  The angle glyph at the
        // top is hard to align with the horizontal line, so overlap them
        // using CSS.
        //
        this.adaptor.addClass(SQRT, 'mjx-tall');
      }
    }

    /**
     * Add root HTML (overridden in mroot)
     *
     * @param {N} ROOT             The container for the root
     * @param {CHTMLWrapper} root  The wrapped MML root content
     * @param {BBox} sbox          The bounding box of the surd
     * @param {number} H           The height of the root as a whole
     */
    protected addRoot(_ROOT: N, _root: CHTMLWrapper<N, T, D>, _sbox: BBox, _H: number) {
    }

  };

})<any, any, any>();
