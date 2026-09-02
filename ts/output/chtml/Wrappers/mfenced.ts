/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  Implements the ChtmlMfenced wrapper for the MmlMfenced object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMfenced,
  CommonMfencedClass,
  CommonMfencedMixin,
} from '../../common/Wrappers/mfenced.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMfenced } from '../../../core/MmlTree/MmlNodes/mfenced.js';
import { ChtmlInferredMrowNTD } from './mrow.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMfenced interface for the CHTML Mfenced wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMfencedNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMfenced<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMfencedClass interface for the CHTML Mfenced wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMfencedClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMfencedClass<
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
  ): ChtmlMfencedNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMfenced wrapper class for the MmlMfenced class
 */
export const ChtmlMfenced = (function (): ChtmlMfencedClass<DOM> {
  const Base = CommonMfencedMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMfencedClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMfenced extends Base implements ChtmlMfencedNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMfenced.prototype.kind;

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      const chtml = this.standardChtmlNodes(parents);
      (this.mrow as ChtmlInferredMrowNTD<DOM>).toCHTML(chtml);
    }
  };
})();
