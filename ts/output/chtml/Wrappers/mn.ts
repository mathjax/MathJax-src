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
 * @file  Implements the ChtmlMn wrapper for the MmlMn object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMn,
  CommonMnClass,
  CommonMnMixin,
} from '../../common/Wrappers/mn.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMn } from '../../../core/MmlTree/MmlNodes/mn.js';
import { DOM, DOM_TYPES } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMn interface for the CHTML Mn wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMnNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMn<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMnClass interface for the CHTML Mn wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMnClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMnClass<
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
  ): ChtmlMnNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMn wrapper class for the MmlMn class
 */
export const ChtmlMn = (function (): ChtmlMnClass<DOM> {
  const Base = CommonMnMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMnClass<DOM>
  >(ChtmlWrapper);

  return class ChtmlMn extends Base implements ChtmlMnNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMn.prototype.kind;
  };
})();
