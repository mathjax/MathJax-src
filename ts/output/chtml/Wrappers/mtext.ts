/*************************************************************
 *
 *  Copyright (c) 2019-2026 The MathJax Consortium
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
 * @file  Implements the ChtmlMtext wrapper for the MmlMtext object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMtext,
  CommonMtextClass,
  CommonMtextMixin,
} from '../../common/Wrappers/mtext.js';
import { MmlNode, TextNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMtext } from '../../../core/MmlTree/MmlNodes/mtext.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMtext interface for the CHTML Mtext wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMtextNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMtext<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMtextClass interface for the CHTML Mtext wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMtextClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMtextClass<
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
  ): ChtmlMtextNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMtext wrapper class for the MmlMtext class
 */
export const ChtmlMtext = (function (): ChtmlMtextClass<DOM> {
  const Base = CommonMtextMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMtextClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMtext extends Base implements ChtmlMtextNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMtext.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      //
      // If no breakpoints, do the usual thing
      //
      if (!this.breakCount) {
        super.toCHTML(parents);
        return;
      }
      //
      // Get the line containers and loop through them
      //
      const chtml = this.standardChtmlNodes(parents);
      const textNode = this.textNode.node as TextNode;
      const childNodes = this.childNodes;
      for (const i of chtml.keys()) {
        const DOM = [chtml[i]];
        this.adaptor.append(chtml[i], this.html('mjx-linestrut'));
        //
        // Get the start and end indices
        //
        let [si, sj] = this.breakPoints[i - 1] || [0, 0];
        const [ei, ej] = this.breakPoints[i] || [childNodes.length, 0];
        //
        // Get the words for the start child, and if the start and end
        //   are in the same child, output the needed words
        //
        let words = (childNodes[si].node as TextNode).getText().split(/ /);
        if (si === ei) {
          textNode.setText(words.slice(sj, ej).join(' '));
          this.textNode.toCHTML(DOM);
          continue;
        }
        //
        // Otherwise, output from the start to the end of the child
        //
        textNode.setText(words.slice(sj).join(' '));
        this.textNode.toCHTML(DOM);
        //
        // Add in any additional full children before the end child
        //
        while (++si < ei && si < childNodes.length) {
          childNodes[si].toCHTML(DOM);
        }
        //
        // Add the beginning of the end child up to the end break
        //
        if (si < childNodes.length) {
          words = (childNodes[si].node as TextNode).getText().split(/ /);
          textNode.setText(words.slice(0, ej).join(' '));
          this.textNode.toCHTML(DOM);
        }
      }
    }
  };
})();
