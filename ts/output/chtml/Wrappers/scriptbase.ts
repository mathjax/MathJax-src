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
 * @fileoverview  Implements the a base class for CHTMLmsubsup, CHTMLmunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonScriptbase, CommonScriptbaseClass, CommonScriptbaseMixin} from '../../common/Wrappers/scriptbase.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {BBox} from '../../../util/BBox.js';
import {StyleData} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLScriptbase interface for the CHTML Scriptbase wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLScriptbaseNTD<N, T, D> extends CHTMLWrapper<N, T, D>, CommonScriptbase<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {

  /**
   * @param {N[]} nodes    The HTML elements to be centered in a stack
   * @param {number[]} dx  The x offsets needed to center the elements
   */
  setDeltaW(nodes: N[], dx: number[]): void;

  /**
   * @param {N} over        The HTML element for the overscript
   * @param {BBox} overbox  The bbox for the overscript
   */
  adjustOverDepth(over: N, overbox: BBox): void;

  /**
   * @param {N} under        The HTML element for the underscript
   * @param {BBox} underbox  The bbox for the underscript
   */
  adjustUnderDepth(under: N, underbox: BBox): void;

  /**
   * @param {N} base        The HTML element for the base
   * @param {BBox} basebox  The bbox for the base
   */
  adjustBaseHeight(base: N, basebox: BBox): void;

}

/**
 * The CHTMLScriptbaseClass interface for the CHTML Scriptbase wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLScriptbaseClass<N, T, D> extends CHTMLWrapperClass<N, T, D>, CommonScriptbaseClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLScriptbaseNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLScriptbase wrapper class for the MmlScriptbase class
 */
export const CHTMLScriptbase = (function <N, T, D>(): CHTMLScriptbaseClass<N, T, D> {

  const Base = CommonScriptbaseMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLScriptbaseClass<N, T, D>
    >(CHTMLWrapper);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLScriptbase extends Base implements CHTMLScriptbaseNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = 'scriptbase';

    /**
     * This gives the common output for msub and msup.  It is overridden
     * for all the others (msubsup, munder, mover, munderover).
     *
     * @override
     */
    public toCHTML(parent: N) {
      this.dom = this.standardCHTMLnode(parent);
      const [x, v] = this.getOffset();
      const dx = x - (this.baseRemoveIc ? this.baseIc : 0);
      const style: StyleData = {'vertical-align': this.em(v)};
      if (dx) {
        style['margin-left'] = this.em(dx);
      }
      this.baseChild.toCHTML(this.dom);
      this.scriptChild.toCHTML(this.adaptor.append(this.dom, this.html('mjx-script', {style})) as N);
    }

    /**
     * @param {N[]} nodes    The HTML elements to be centered in a stack
     * @param {number[]} dx  The x offsets needed to center the elements
     */
    public setDeltaW(nodes: N[], dx: number[]) {
      for (let i = 0; i < dx.length; i++) {
        if (dx[i]) {
          this.adaptor.setStyle(nodes[i], 'paddingLeft', this.em(dx[i]));
        }
      }
    }

    /**
     * @param {N} over        The HTML element for the overscript
     * @param {BBox} overbox  The bbox for the overscript
     */
    public adjustOverDepth(over: N, overbox: BBox) {
      if (overbox.d >= 0) return;
      this.adaptor.setStyle(over, 'marginBottom', this.em(overbox.d * overbox.rscale));
    }

    /**
     * @param {N} under        The HTML element for the underscript
     * @param {BBox} underbox  The bbox for the underscript
     */
    public adjustUnderDepth(under: N, underbox: BBox) {
      if (underbox.d >= 0) return;
      const adaptor = this.adaptor;
      const v = this.em(underbox.d);
      const box = this.html('mjx-box', {style: {'margin-bottom': v, 'vertical-align': v}});
      for (const child of adaptor.childNodes(adaptor.firstChild(under) as N) as N[]) {
        adaptor.append(box, child);
      }
      adaptor.append(adaptor.firstChild(under) as N, box);
    }

    /**
     * @param {N} base        The HTML element for the base
     * @param {BBox} basebox  The bbox for the base
     */
    public adjustBaseHeight(base: N, basebox: BBox) {
      if (this.node.attributes.get('accent')) {
        const minH = this.font.params.x_height * basebox.scale;
        if (basebox.h < minH) {
          this.adaptor.setStyle(base, 'paddingTop', this.em(minH - basebox.h));
          basebox.h = minH;
        }
      }
    }

  };

})<any, any, any>();
