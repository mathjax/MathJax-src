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
 * @file  Implements the a base class for ChtmlMsubsup, ChtmlMunderover
 *                and their relatives.  (Since munderover can become msubsup
 *                when movablelimits is set, munderover needs to be able to
 *                do the same thing as msubsup in some cases.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonScriptbase,
  CommonScriptbaseClass,
  CommonScriptbaseMixin,
} from '../../common/Wrappers/scriptbase.js';
import { ChtmlMsubsup } from './msubsup.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { BBox } from '../../../util/BBox.js';
import { StyleJsonData } from '../../../util/StyleJson.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlScriptbase interface for the CHTML Scriptbase wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlScriptbaseNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonScriptbase<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {
  /**
   * @param {N[]} nodes    The HTML elements to be centered in a stack
   * @param {number[]} dx  The x offsets needed to center the elements
   */
  setDeltaW(nodes: N<DOM>[], dx: number[]): void;

  /**
   * @param {N} over        The HTML element for the overscript
   * @param {BBox} overbox  The bbox for the overscript
   */
  adjustOverDepth(over: N<DOM>, overbox: BBox): void;

  /**
   * @param {N} under        The HTML element for the underscript
   * @param {BBox} underbox  The bbox for the underscript
   */
  adjustUnderDepth(under: N<DOM>, underbox: BBox): void;

  /**
   * @param {N} base        The HTML element for the base
   * @param {BBox} basebox  The bbox for the base
   */
  adjustBaseHeight(base: N<DOM>, basebox: BBox): void;
}

/**
 * The ChtmlScriptbaseClass interface for the CHTML Scriptbase wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlScriptbaseClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonScriptbaseClass<
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
  ): ChtmlScriptbaseNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlScriptbase wrapper class for the MmlScriptbase class
 */
export const ChtmlScriptbase = (function (): ChtmlScriptbaseClass<DOM> {
  const Base = CommonScriptbaseMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlScriptbaseClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlScriptbase extends Base implements ChtmlScriptbaseNTD<DOM> {
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
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      this.dom = this.standardChtmlNodes(parents);
      const [x, v] = this.getOffset();
      const dx = x - (this.baseRemoveIc ? this.baseIc : 0);
      const style: StyleJsonData = { 'vertical-align': this.em(v) };
      if (dx) {
        style['margin-left'] = this.em(dx);
      }
      this.baseChild.toCHTML(this.dom);
      const dom = this.dom[this.dom.length - 1];
      this.scriptChild.toCHTML([
        this.adaptor.append(dom, this.html('mjx-script', { style })) as N<DOM>,
      ]);
    }

    /**
     * Make sure styles get output for any script subclass
     *
     * @override
     */
    public markUsed() {
      super.markUsed();
      this.jax.wrapperUsage.add(ChtmlMsubsup.kind);
    }

    /**
     * @param {N[]} nodes    The HTML elements to be centered in a stack
     * @param {number[]} dx  The x offsets needed to center the elements
     */
    public setDeltaW(nodes: N<DOM>[], dx: number[]) {
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
    public adjustOverDepth(over: N<DOM>, overbox: BBox) {
      if (overbox.d >= 0) return;
      this.adaptor.setStyle(
        over,
        'marginBottom',
        this.em(overbox.d * overbox.rscale)
      );
    }

    /**
     * @param {N} under        The HTML element for the underscript
     * @param {BBox} underbox  The bbox for the underscript
     */
    public adjustUnderDepth(under: N<DOM>, underbox: BBox) {
      if (underbox.d >= 0) return;
      const adaptor = this.adaptor;
      const v = this.em(underbox.d);
      const box = this.html('mjx-box', {
        style: { 'margin-bottom': v, 'vertical-align': v },
      });
      for (const child of adaptor.childNodes(
        adaptor.firstChild(under) as N<DOM>
      ) as N<DOM>[]) {
        adaptor.append(box, child);
      }
      adaptor.append(adaptor.firstChild(under) as N<DOM>, box);
    }

    /**
     * @param {N} base        The HTML element for the base
     * @param {BBox} basebox  The bbox for the base
     */
    public adjustBaseHeight(base: N<DOM>, basebox: BBox) {
      if (this.node.attributes.get('accent')) {
        const minH = this.font.params.x_height * this.baseScale;
        if (basebox.h < minH) {
          this.adaptor.setStyle(base, 'paddingTop', this.em(minH - basebox.h));
          basebox.h = minH;
        }
      }
    }
  };
})();
