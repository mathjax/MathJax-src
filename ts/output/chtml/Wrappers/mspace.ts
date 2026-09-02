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
 * @file  Implements the ChtmlMspace wrapper for the MmlMspace object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMspace,
  CommonMspaceClass,
  CommonMspaceMixin,
} from '../../common/Wrappers/mspace.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMspace } from '../../../core/MmlTree/MmlNodes/mspace.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMspace interface for the CHTML Mspace wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMspaceNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMspace<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMspaceClass interface for the CHTML Mspace wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMspaceClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMspaceClass<
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
  ): ChtmlMspaceNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMspace wrapper class for the MmlMspace class
 */
export const ChtmlMspace = (function (): ChtmlMspaceClass<DOM> {
  const Base = CommonMspaceMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMspaceClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMspace extends Base implements ChtmlMspaceNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMspace.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      if (parents.length > 1) {
        parents.forEach((dom) =>
          this.adaptor.append(dom, this.html('mjx-linestrut'))
        );
      }
      const chtml = this.standardChtmlNodes(parents);
      let { w, h, d } = this.getBBox();
      if (w < 0) {
        this.adaptor.setStyle(chtml[0], 'marginRight', this.em(w));
        w = 0;
      }
      if (w && !this.breakCount) {
        this.adaptor.setStyle(chtml[0], 'width', this.em(w));
      }
      h = Math.max(0, h + d);
      if (h) {
        this.adaptor.setStyle(chtml[0], 'height', this.em(Math.max(0, h)));
      }
      if (d) {
        this.adaptor.setStyle(chtml[0], 'verticalAlign', this.em(-d));
      }
    }
  };
})();
